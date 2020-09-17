<template>
  <div class="text-center post-container" ref="postContainer">
    <div class="waterfall-container" v-if="infiniteScrollPosts">
      <div
        class="waterfall-item"
        v-for="postImg in waterfallList"
        :key="postImg.id"
        :style="{top: postImg.top+'px', left:postImg.left+'px',width: imgWidth +'px',height:postImg.height +'px'}"
        @click="goToPost(postImg._id)"
      >
        <div class="img-container">
          <img :src="postImg.imgUrl" class="waterfall-item-img" />
          <div class="overlay">
            <h3>{{ postImg.title }}</h3>
            <div>
              <v-icon class="mr-1" color="red">mdi-heart</v-icon>
              <span class="subheading mr-2">{{ postImg.likes }}</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1" color="white">mdi-chat</v-icon>
              <span class="subheading">{{ postImg.messages.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="observer" ref="loadingObserver" v-show="showMoreEnabled && imgList.length"></div>
  </div>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../queries";

const pageSize = 20;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      observer: null,
      waterfallList: [],
      imgList: [],
      imgWidth: "",
      waterfallCols: 5,
      imgMargin: 10,
      screenWidth: document.body.clientWidth,
      currentColsHeights: [],
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
    observerCallback([entry]) {
      if (!this.infiniteScrollPosts) return
      if (entry && entry.isIntersecting && this.showMoreEnabled) {
        this.showMorePosts();
      }
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    calculateImgWidth() {
      this.imgWidth =((this.screenWidth - this.waterfallCols * this.imgMargin) / this.waterfallCols) * 0.8;
      this.currentColsHeights = Array.from({ length: this.waterfallCols }).fill(0);
      this.imgPreProcess();
    },
    imgPreProcess() {
      const { imgList, imgWidth, imgMargin, waterfallList } = this;
      this.waterfallList = [];
      for (let i = 0; i < imgList.length; i++) {
        const newImg = new Image();
        newImg.src = imgList[i].imgUrl;
        newImg.onload = () => {
          const imgData = Object.assign({}, imgList[i]);
          newImg.height = (imgWidth / newImg.width) * newImg.height;
          imgData.height = newImg.height;
          this.waterfallList.push(imgData);
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
      imgData.top = this.currentColsHeights[minIndex];
      imgData.left = minIndex * (imgMargin + imgWidth);
      this.currentColsHeights[minIndex] += imgData.height + imgMargin;
    },
    findMinHeightColIndex() {
      const minHeight = Math.min(...this.currentColsHeights);
      return this.currentColsHeights.indexOf(minHeight);
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(this.observerCallback, {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
    if (this.showMoreEnabled) {
      this.observer.observe(this.$refs.loadingObserver);
    }

    const self = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        self.screenWidth = window.screenWidth;
      })();
    };
  },
  watch: {
    showMoreEnabled(val) {
      if (val) {
        this.$nextTick(() => this.observer.observe(this.$refs.loadingObserver));
      } else {
        this.observer.disconnect();
      }
    },
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        let self = this;
        setTimeout(function () {
          self.calculateImgWidth();
          self.timer = false;
        }, 500);
      }
    },
    infiniteScrollPosts(val) {
      this.imgList = val.posts;
      this.calculateImgWidth();
    },
  },
};
</script>


<style lang="stylus" scoped>
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

.img-container
  position relative
  right 10%
  cursor zoom-in
  
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
    padding 1em 1.2em
    
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