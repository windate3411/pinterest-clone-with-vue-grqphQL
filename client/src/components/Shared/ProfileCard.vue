<template>
  <v-container class="mt-3 profile-container">
    <!-- profile Card -->
    <v-row class="text-center">
      <v-col cols="12">
        <v-avatar size="78">
          <v-img :src="user.avatar" contain></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="12">
        <h1>{{ user.username }}</h1>
      </v-col>
      <v-col cols="12">
        <span>Joined since {{ userJoinDate }}</span>
      </v-col>
      <v-col cols="12">
        <span>{{ user.favorites.length }} Favorites</span>
      </v-col>
    </v-row>
    <!-- operations -->
    <v-row justify="end">
      <v-col cols="1">
        <div class="icon-wrapper" @click="goToAddPost">
          <i class="fas fa-plus"></i>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import dayjs from 'dayjs'

export default {
  name: 'ProfileCard',
  props:['user'],
  methods: {
    goToAddPost() {
      this.$router.push('/post/add')
    }
  },
  computed: {
    userJoinDate() {
      if (!this.user) return
      return dayjs(Number(this.user.joinDate)).format('YYYY-MM-DD')
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

</style>