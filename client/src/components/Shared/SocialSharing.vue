<template>
  <v-dialog hide-overlay width="360" v-model="socialSharingDialog">
    <v-card rounded>
      <v-container class="sharing-dialog-wrapper">
        <v-row justify="center">
          <v-card-title class="text-center">Share this post</v-card-title>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-center">
            <ShareNetwork
              network="twitter"
              :url="post.imgUrl"
              :title="post.title"
              :description="post.description"
              :hashtags="post.categories.join(',')"
            >
              <div class="social-icon-wrapper">
                <i class="fab fa-twitter"></i>
                <span>Twitter</span>
              </div>
            </ShareNetwork>
            <ShareNetwork
              network="line"
              :url="post.imgUrl"
              :title="post.title"
              :description="post.description"
            >
              <div class="social-icon-wrapper">
                <i class="fab fa-line"></i>
                <span>Line</span>
              </div>
            </ShareNetwork>
            <ShareNetwork
              network="facebook"
              :url="post.imgUrl"
              :title="post.title"
              :description="post.description"
              :quote="post.description"
              :hashtags="post.categories.join(',')"
            >
              <div class="social-icon-wrapper">
                <i class="fab fa-facebook"></i>
                <span>Facebook</span>
              </div>
            </ShareNetwork>
            <ShareNetwork
              network="email"
              :url="post.imgUrl"
              :title="post.title"
              :description="post.description"
              class="mr-1"
            >
              <div class="social-icon-wrapper">
                <i class="far fa-envelope"></i>
                <span>Email</span>
              </div>
            </ShareNetwork>
            <div class="social-icon-wrapper" @click="handleCopy">
              <i class="fas fa-link"></i>
              <span>Copy link</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['socialSharingDialog', 'post'],
  methods: {
    handleCopy() {
      this.$emit('handleCopy')
    }
  },
}
</script>

<style lang="stylus" scoped>
.sharing-dialog-wrapper
  .social-icon-wrapper
    display flex
    flex-direction column
    align-items center
    width 72px

    span
      font-size 12px
      color #111111
      cursor pointer
      transform translateX(-12%)
      font-weight 700
  i
    font-size 48px
    border-radius 50%
    margin-right 8px
    cursor pointer

  .fa-line
    color #00B900

  .fa-twitter
    color #00ACEE

  .fa-facebook
    color #3B5998

  .fa-envelope
    color #767676


</style>