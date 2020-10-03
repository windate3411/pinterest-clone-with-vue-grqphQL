<template>
  <v-container>
    <UserProfileCard :user="currentUser" />
    <!-- tabs -->
    <v-tabs v-model="tab" icon-and-text>
      <v-tabs-slider></v-tabs-slider>
      <v-tab href="#favorites">
        Favorites
        <v-icon class="ml-2">mdi-heart</v-icon>
      </v-tab>
      <v-tab href="#userPosts">
        Your Posts
        <v-icon class="ml-2">mdi-chat</v-icon>
      </v-tab>
    </v-tabs>

    <!-- display posts -->
    <PostCard :posts="renderPosts" />

    <!-- observer -->
    <div class="d-flex justify-center mt-5">
      <v-progress-circular
        indeterminate
        color="primary"
        v-intersect="onIntersect"
        v-if="hasMore"
      ></v-progress-circular>
    </div>
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
  data() {
    return {
      isIntersecting: false,
      pageNum: 1,
      numsPerPage: 4,
      tab: ''
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'userPosts']),
    renderPosts() {
      const posts = this.tab === 'userPosts'? this.userPosts : this.currentUser.favorites
      return posts.slice(0,this.pageNum * this.numsPerPage)
    },
    hasMore() {
      const posts = this.tab === 'userPosts'? this.userPosts : this.currentUser.favorites
      return posts.length !== this.renderPosts.length
    }
  },
  methods: {
    ...mapActions(['getUserPosts']),
    handleGetUserPosts() {
      this.getUserPosts({
        user_id:this.currentUser._id
      })
    },
    onIntersect (entries, observer) {
        this.isIntersecting = entries[0].isIntersecting
        if (entries[0].isIntersecting) {
          this.handleScroll()
        }
    },
    handleScroll() {
      this.pageNum++
    }

  },
  created() {
    this.handleGetUserPosts()
  },
}
</script>
