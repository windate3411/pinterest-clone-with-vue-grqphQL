<template>
  <v-container>
    <UserProfileCard />
  </v-container>
</template>

<script>
import UserProfileCard from '../Shared/ProfileCard'

export default {
  name: 'Profile',
  components: {
    UserProfileCard
  },
}
</script>
