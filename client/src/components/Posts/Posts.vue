<template>
  <v-container v-if="infiniteScrollPosts" class="text-center">
    <div v-for="post in infiniteScrollPosts.posts" :key="post._id">
      <img :src="post.imgUrl" height="100px" />
      <h3>{{post.title}}</h3>
    </div>
    <v-btn @click="showMorePosts" v-if="showMoreEnabled">Fetch more</v-btn>
  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../queries";

const pageSize = 2;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
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
  },
};
</script>
