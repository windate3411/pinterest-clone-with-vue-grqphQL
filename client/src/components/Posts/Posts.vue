<template>
  <v-container fluid class="text-center">
    <!-- Posts Cards -->
    <v-row v-if="infiniteScrollPosts">
      <v-col xs="12" sm="6" v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover class="mx-auto" fill-height @click.native="goToPost(post._id)">
          <v-img :src="post.imgUrl" height="30vh" lazy-src></v-img>
          <v-card-title>{{post.title}}</v-card-title>
          <v-card-actions>
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <v-img class="elevation-6" :src="post.createdBy.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{post.createdBy.username}}</v-list-item-title>
              </v-list-item-content>

              <v-row align="center" justify="end">
                <v-icon class="mr-1">mdi-heart</v-icon>
                <span class="subheading mr-2">{{post.likes}}</span>
                <span class="mr-1">·</span>
                <v-icon class="mr-1">mdi-chat</v-icon>
                <span class="subheading">{{post.messages.length}}</span>
                <v-icon right>mdi-chevron-down</v-icon>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="showMoreEnabled">
      <v-col justify="center" xs="12">
        <v-btn @click="showMorePosts" color="info" dense>Fetch more</v-btn>
      </v-col>
    </v-row>
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
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
  },
};
</script>
