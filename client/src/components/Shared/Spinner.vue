<template>
  <div class="spinner-container d-flex justify-center align-center">
    <v-progress-circular
      indeterminate
      :size="size"
      width="4"
      :color="color"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      default: 'primary'
    },
    size: {
      default: 64
    }
  }
}
</script>

<style lang="stylus" scoped>
.spinner-container
  height 100vh

</style>