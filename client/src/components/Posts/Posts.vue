<template>
  <v-container fluid class="text-center post-container" ref="postContainer">
    <!-- Posts Cards -->
    <v-row v-if="infiniteScrollPosts">
      <v-col xs="12" sm="4" md="3" v-for="post in infiniteScrollPosts.posts" :key="post.id">
        <v-card hover class="mx-auto" fill-height @click.native="goToPost(post._id)">
          <div class="img-container">
            <v-img :src="post.imgUrl" height="30vh" lazy-src></v-img>
            <div class="overlay">
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
        </v-card>
      </v-col>
    </v-row>
    <div class="observer" ref="loadingObserver" v-if="showMoreEnabled"></div>
    <h1 v-if="!showMoreEnabled">There's no more posts</h1>
  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../queries";

const pageSize = 10;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      observer: null,
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
          console.log("the prev are", previousResult);
          console.log("the fetch more", fetchMoreResult);
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
      if (entry && entry.isIntersecting) {
        this.showMorePosts();
      }
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(this.observerCallback, {
      root: null,
      rootMargin: "0px 0px 200px 0px",
      threshold: 0,
    });
    if (this.showMoreEnabled) {
      this.observer.observe(this.$refs.loadingObserver);
    }
  },
  watch: {
    showMoreEnabled(val) {
      if (val) {
        this.$nextTick(() => this.observer.observe(this.$refs.loadingObserver));
      } else {
        this.observer.disconnect();
      }
    },
  },
};
</script>


<style lang="stylus" scoped>

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


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>