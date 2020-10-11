<template>
  <div>
    <v-container v-if="isLoading">
      <Spinner />
    </v-container>
    <v-container
      fluid
      class="mt-5"
      v-if="!isLoading && infiniteScrollPosts"
      v-resize="onResize"
    >
      <!-- copy to clipboard snackbar -->
      <v-snackbar
        v-model="clipboardMessageShown"
        top
        transition="fab-transition"
        timeout="2000"
        color="#5cb85c"
      >
        <h3 class="text-center">Copy to Clipboard!</h3>
      </v-snackbar>
      <SocialSharing
        v-if="sharingModal"
        :post="selectedPost"
        :sharingModal="sharingModal"
        @handleCopy="copyToClipBoard(selectedPost.imgUrl)"
      />

      <!-- FloatingButton -->
      <FloatingButton />
      <div class="waterfall-wrapper">
        <v-row>
          <v-col
            v-for="(item, index) in waterfallCols"
            :key="item.id"
            :cols="12 / waterfallCols"
            class="pa-1"
          >
            <div
              class="image-wrapper"
              v-for="post in waterfallList[index]"
              :key="post.id"
            >
              <v-img :src="post.imgUrl" class="rounded-lg"></v-img>
              <div class="overlay" @click.stop="goToPost(post._id)">
                <div class="operators">
                  <div class="icon-wrapper">
                    <v-icon
                      class="icon"
                      @click.stop="hanldeImageDownload(post.imgUrl)"
                      >mdi-download</v-icon
                    >
                  </div>
                  <div class="icon-wrapper ml-1">
                    <v-icon class="icon" @click.stop="handleSharing(post)"
                      >mdi-share</v-icon
                    >
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex justify-center mt-5">
          <v-progress-circular
            indeterminate
            color="primary"
            v-intersect="onIntersect"
            v-if="infiniteScrollPosts.hasMorePosts"
          ></v-progress-circular>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from '../../queries'
import Spinner from '../Shared/Spinner.vue'
import SocialSharing from '../Shared/SocialSharing'
import FloatingButton from '../Shared/FloatingButton'
import { downloadImage } from '@/utils'
import { mapGetters, mapActions } from 'vuex'

const pageSize = 30

export default {
  name: 'Posts',
  components: {
    Spinner,
    SocialSharing,
    FloatingButton
  },
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      observer: null,
      waterfallList: [],
      imgList: [],
      imgWidth: '',
      waterfallCols: 6,
      imgMargin: 10,
      screenWidth: document.body.clientWidth,
      currentColsHeights: [],
      isLoading: false,
      selectedPost: '',
      clipboardMessageShown: false,
    }
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize,
      },
    },
  },
  methods: {
    ...mapActions(['toggleSharingModal']),
    hanldeImageDownload(imgUrl) {
      downloadImage(imgUrl)
    },
    handleSharing(post) {
      this.selectedPost = post
      this.toggleSharingModal()
    },
    async copyToClipBoard(imgUrl) {
      await navigator.clipboard.writeText(imgUrl)
      this.clipboardMessageShown = true
    },
    showMorePosts() {
      if (!this.infiniteScrollPosts.hasMorePosts) return
      this.pageNum++
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts
          const hasMorePosts = fetchMoreResult.infiniteScrollPosts.hasMorePosts
          this.showMoreEnabled = hasMorePosts
          return {
            infiniteScrollPosts: {
              __typename: previousResult.infiniteScrollPosts.__typename,
              posts: [...previousResult.infiniteScrollPosts.posts, ...newPosts],
              hasMorePosts,
            },
          }
        },
      })
    },
    onIntersect(entries, observer) {
      if (entries[0].isIntersecting) {
        this.handleScroll()
      }
    },
    handleScroll() {
      this.showMorePosts()
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`)
    },
    setImgWidth() {
      this.imgWidth =
        ((this.screenWidth - this.waterfallCols * this.imgMargin) /
          this.waterfallCols) *
        0.9
      this.currentColsHeights = Array.from({ length: this.waterfallCols }).fill(
        0
      )
      this.waterfallList = Array.from({
        length: this.waterfallCols,
      }).map((item) => [])
    },
    processImgs(arr) {
      for (let i = 0; i < arr.length; i++) {
        const newImg = new Image()
        newImg.src = arr[i].imgUrl
        newImg.onload = () => {
          const imgData = Object.assign({}, arr[i])
          newImg.height = (this.imgWidth / newImg.width) * newImg.height
          imgData.height = newImg.height
          this.setImgPosition(imgData)
        }
      }
    },
    setImgPosition(imgData) {
      const {
        imgList,
        imgWidth,
        imgMargin,
        waterfallList,
        currentColsHeights,
      } = this
      const minIndex = this.findMinHeightColIndex()
      this.waterfallList[minIndex].push(imgData)
      this.currentColsHeights[minIndex] += imgData.height + imgMargin
    },
    findMinHeightColIndex() {
      const minHeight = Math.min(...this.currentColsHeights)
      return this.currentColsHeights.indexOf(minHeight)
    },
    onResize() {
      this.screenWidth = window.innerWidth
    },
    recalculateCols(cols) {
      this.waterfallCols = cols
      this.setImgWidth()
      this.processImgs(this.renderList)
    },
    showSpinner() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
  },
  computed: {
    ...mapGetters(['sharingModal']),
    renderList() {
      if (!this.infiniteScrollPosts) return []
      this.selectedPost = this.infiniteScrollPosts.posts[0]
      return this.infiniteScrollPosts.posts
    },
  },
  mounted() {
    this.setImgWidth()
  },
  watch: {
    screenWidth(val) {
      this.showSpinner()
      if (val <= 600) return (this.waterfallCols = 2)
      if (val <= 960) return (this.waterfallCols = 4)
      this.waterfallCols = 6
    },
    renderList(val, oldVal) {
      const diffArr = val.filter((item) => !oldVal.includes(item))
      this.processImgs(diffArr)
    },
    waterfallCols(val) {
      this.recalculateCols(val)
    },
  },
}
</script>

<style lang="stylus" scoped>
.waterfall-wrapper
  padding 20px
  transform translateX(18px)

.post-container
  position relative
  height 100vh
  display flex
  flex-direction column
  align-items  center

.observer
  margin 15px auto
  border 5px solid #f3f3f3
  border-top 5px solid #60A917
  border-radius 50%
  width 20px
  height 20px
  animation spin 2s linear infinite

.image-wrapper
  position relative
  right 10%
  cursor zoom-in
  display flex
  justify-content center
  margin-bottom 24px

  .overlay
    background-color rgba(0,0,0,0.3)
    opacity 0
    height 100%
    width 100%
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    color white
    display flex
    flex-direction column
    align-items flex-end
    justify-content flex-end
    transition opacity 0.2s ease-in
    border-radius 8px

    .operators
      display flex
      margin 5px

      .icon-wrapper
        height 32px
        width 32px
        background-color hsla(0,0%,100%,0.8)
        border-radius 50%
        position relative
        margin 0
        cursor pointer

        .icon
          font-size 16px
          border-radius 50%
          color #222
          font-weight bold
          position absolute
          left 50%
          top 50%
          transform translate(-50%,-50%)

  &:hover
    .overlay
      opacity 1
</style>
