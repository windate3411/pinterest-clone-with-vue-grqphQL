<template>
  <v-container>
    <UserProfileCard :user="currentUser" />
    <PostCard :posts="currentUser.favorites" />
  </v-container>
</template>

<script>
import UserProfileCard from '../Shared/ProfileCard'
import PostCard from '../Shared/PostCard'
import {mapGetters} from 'vuex'

export default {
  name: 'Profile',
  components: {
    UserProfileCard,
    PostCard
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
}
</script>
