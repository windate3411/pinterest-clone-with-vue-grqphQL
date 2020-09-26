<template>
  <v-container class="mt-3 profile-container">
    <!-- profile Card -->
    <v-row class="text-center">
      <v-col cols="12">
        <v-avatar size="78">
          <v-img :src="currentUser.avatar" contain></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="12">
        <h1>{{ currentUser.username }}</h1>
      </v-col>
      <v-col cols="12">
        <span>Joined since {{ userJoinDate }}</span>
      </v-col>
      <v-col cols="12">
        <span>{{ currentUser.favorites.length }} Favorites</span>
      </v-col>
    </v-row>
    <!-- operations -->
    <v-row justify="end">
      <v-col cols="1">
        <div class="icon-wrapper">
          <i class="fas fa-plus"></i>
        </div>
      </v-col>
    </v-row>
    <!-- favorites -->
    <v-row v-if="currentUser.favorites.length" align="stretch">
      <v-col
        xs="12"
        sm="6"
        md="3"
        v-for="post in currentUser.favorites"
        :key="post.id"
      >
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
  </v-container>
</template>


<script>
import dayjs from 'dayjs'
import {mapGetters} from 'vuex'

export default {
  name: 'ProfileCard',
  data() {
    return {
      
    }
  },
  methods: {
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    userJoinDate() {
      if (!this.currentUser) return
      return dayjs(Number(this.currentUser.joinDate)).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="stylus" scoped>

.profile-container
  span
    color #111111
    font-size 16px


  .icon-wrapper
    display flex
    align-items center
    justify-content center
    border-radius 50%
    height 48px
    width 48px
    cursor pointer

    &:hover
      background-color #F5F5F5

  .fa-plus
    color #111
    font-size 24px
    font-weight 900

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


</style>