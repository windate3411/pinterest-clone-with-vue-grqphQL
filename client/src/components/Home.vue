<template>
  <v-container>
    <v-overlay v-if="!getPosts">
      <v-progress-circular indeterminate size="128"
        >Loading</v-progress-circular
      >
    </v-overlay>
    <v-row v-else>
      <v-col xs="12">
        <v-carousel circle>
          <v-carousel-item
            v-for="post in posts"
            :key="post._id"
            :src="post.imgUrl"
          >
            <h1 class="text-center carousel-title">{{ post.title }}</h1>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { gql } from 'apollo-boost'

export default {
  name: 'Home',
  data() {
    return {
      posts: [],
    }
  },
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            _id
            imgUrl
            likes
            description
            title
          }
        }
      `,
      result({ data, loading }) {
        if (!loading) this.posts = data.getPosts
      },
      error(err) {
        console.error('[Error Message]', err)
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
.carousel-title
  position absolute
  background-color rgba(0,0,0,0.5)
  color #fff
  bottom 50px
  border-radius 5px 5px 0 0
  padding 0.5em
  left 0
  right 0
</style>
