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
                <h3>{{ post.title }}</h3>
                <div>
                  <v-icon class="mr-1" color="red">mdi-heart</v-icon>
                  <span class="subheading mr-2">{{ post.likes }}</span>
                  <span class="mr-1">·</span>
                  <v-icon class="mr-1" color="white">mdi-chat</v-icon>
                  <span class="subheading">{{ post.messages.length }}</span>
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
import { INFINITE_SCROLL_POSTS } from "../../queries";
import Spinner from '../Shared/Spinner.vue'

const pageSize = 30;

export default {
  name: "Posts",
  components: {
    Spinner
  },
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      observer: null,
      waterfallList: [],
      imgList: [],
      imgWidth: "",
      waterfallCols: 6,
      imgMargin: 10,
      screenWidth: document.body.clientWidth,
      currentColsHeights: [],
      isLoading: false
    };
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
    showMorePosts() {
      if (!this.infiniteScrollPosts.hasMorePosts) return
      this.pageNum++;
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMorePosts = fetchMoreResult.infiniteScrollPosts.hasMorePosts;
          this.showMoreEnabled = hasMorePosts;
          return {
            infiniteScrollPosts: {
              __typename: previousResult.infiniteScrollPosts.__typename,
              posts: [...previousResult.infiniteScrollPosts.posts, ...newPosts],
              hasMorePosts,
            },
          };
        },
      });
    },
    onIntersect (entries, observer) {
        if (entries[0].isIntersecting) {
          this.handleScroll()
        }
    },
    handleScroll() {
      this.showMorePosts()
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    setImgWidth() {
      this.imgWidth =((this.screenWidth - this.waterfallCols * this.imgMargin) / this.waterfallCols) * 0.9;
      this.currentColsHeights = Array.from({ length: this.waterfallCols }).fill(0);
      this.waterfallList = Array.from({ length: this.waterfallCols }).map(item=> [])
    },
    processImgs(arr) {
      for (let i = 0; i < arr.length; i++) {
        const newImg = new Image()
        newImg.src = arr[i].imgUrl
        newImg.onload = () => {
          const imgData = Object.assign({}, arr[i]);
          newImg.height = (this.imgWidth / newImg.width) * newImg.height;
          imgData.height = newImg.height;
          this.setImgPosition(imgData);
        };
      }
    },
    setImgPosition(imgData) {
      const {
        imgList,
        imgWidth,
        imgMargin,
        waterfallList,
        currentColsHeights,
      } = this;
      const minIndex = this.findMinHeightColIndex();
      this.waterfallList[minIndex].push(imgData)
      this.currentColsHeights[minIndex] += imgData.height + imgMargin;
    },
    findMinHeightColIndex() {
      const minHeight = Math.min(...this.currentColsHeights);
      return this.currentColsHeights.indexOf(minHeight);
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
      setTimeout(()=>{
        this.isLoading = false
      },500)
    }
  },
  computed: {
    renderList() {
      if (!this.infiniteScrollPosts) return []
      return this.infiniteScrollPosts.posts
    },
  },
  mounted() {
    this.setImgWidth()
  },
  watch: {
    screenWidth(val) {
      this.showSpinner()
      if (val <= 600) return this.waterfallCols = 2
      if (val <= 960) return this.waterfallCols = 4
      this.waterfallCols = 6
    },
    renderList(val,oldVal) {
      const diffArr = val.filter(item => !oldVal.includes(item))
      this.processImgs(diffArr)
    },
    waterfallCols(val) {
      this.recalculateCols(val)
    }
  },
};
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
    align-items center
    justify-content center
    transition opacity 0.2s ease-in
    border-radius 8px
    
  &:hover
    .overlay
      opacity 1

.waterfall-container
  position relative
  height 100%
  width 100%

  .waterfall-item
    position absolute

    .waterfall-item-img
      height 100%
      width 100%

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>