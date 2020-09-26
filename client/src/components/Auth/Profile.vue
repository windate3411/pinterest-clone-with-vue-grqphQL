<template>
  <v-container>
    <UserProfileCard :user="currentUser" />
    <PostCard :posts="currentUser.favorites" />
  </v-container>
</template>

<script>
import UserProfileCard from '../Shared/ProfileCard'
import PostCard from '../Shared/PostCard'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Profile',
  components: {
    UserProfileCard,
    PostCard
  },
  computed: {
    ...mapGetters(['currentUser', 'userPosts'])
  },
  methods: {
    ...mapActions(['getUserPosts']),
    handleGetUserPosts() {
      console.log(this.currentUser._id)
      this.getUserPosts({
        user_id:this.currentUser._id
      })
    }
  },
  created() {
    this.handleGetUserPosts()
  },
}
</script>
