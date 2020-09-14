<template>
  <v-container>
    <h1>Post {{post_id}}</h1>
  </v-container>
</template>

<script>
export default {
  name: "Post",
  props: ["post_id"],
  data() {
    return {};
  },
};
</script>