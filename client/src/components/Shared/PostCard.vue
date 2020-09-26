<template>
  <v-row align="stretch">
    <v-col xs="12" sm="6" md="3" v-for="post in posts" :key="post.id">
      <v-card height="200px" @click.stop="goToPost(post._id)">
        <v-img
          :src="post.imgUrl"
          height="100%"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        >
          <v-card-title class="justify-center">{{ post.title }}</v-card-title>
        </v-img>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ['posts'],
  methods: {
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
}
</script>