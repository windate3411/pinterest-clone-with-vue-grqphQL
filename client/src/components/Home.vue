<template>
  <v-container>
    <h1>Home2</h1>
    <ul v-for="post in getPosts" :key="post.id">
      <li>{{ post.title }}</li>
    </ul>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { gql } from 'apollo-boost'

export default {
  name: 'Home',
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            description
            title
          }
        }
      `,
    },
  },
}
</script>
