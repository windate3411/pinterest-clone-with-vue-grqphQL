<template>
  <div class="mb-5">
    <!-- auth snackbar -->
    <v-snackbar v-model="authSnackbarShown" :timeout="timeout" color="success">
      <v-icon left>mdi-check</v-icon>
      <span v-if="currentUser">You've successfully signed in!</span>
      <span v-else>You've successfully logged out!</span>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="authSnackbarShown = false"
          >X</v-btn
        >
      </template>
    </v-snackbar>

    <!-- auth error snackbar -->
    <v-snackbar
      v-model="authErrorSnackbarShown"
      :timeout="timeout"
      color="error"
      v-if="authError"
    >
      <v-icon left>mdi-cancel</v-icon>
      <span>{{ authError.message }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="authErrorSnackbarShown = false"
          >X</v-btn
        >
      </template>
    </v-snackbar>

    <!--signin modal -->
    <v-dialog v-model="loginDialog" width="450">
      <SigninModal @toggleSignupModal="toggleModal" />
    </v-dialog>

    <!-- signup modal -->
    <v-dialog v-model="signupDialog" width="450">
      <SignupModal @toggleSigninModal="toggleModal" />
    </v-dialog>

    <!-- sidebar -->
    <v-navigation-drawer app temporary fixed v-model="sidebarShown">
      <v-app-bar color="accent" dense text>
        <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title white--text text--darken-4 pl-5">Vinterest</h1>
        </router-link>
      </v-app-bar>

      <!-- side-bar-links -->
      <v-list rounded class="mt-5">
        <v-list-item-group v-model="sideBarSeletedItem" color="primary">
          <v-list-item
            v-for="(item, i) in sidebarItems"
            :key="i"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            class="mt-2"
            v-if="!currentUser"
            @click.stop="loginDialog = true"
          >
            <v-list-item-icon>
              <v-icon v-text="'mdi-login'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Log In'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            class="mt-2"
            v-if="!currentUser"
            @click.stop="signupDialog = true"
          >
            <v-list-item-icon>
              <v-icon v-text="'mdi-lead-pencil'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Sign up'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="mt-2" v-if="currentUser" @click="signoutUser">
            <v-list-item-icon>
              <v-icon v-text="'mdi-exit-to-app'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Log Out'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- nav -->
    <v-app-bar color="white" elevation="3" fixed>
      <v-app-bar-nav-icon
        @click="sidebarShown = !sidebarShown"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>
        <div class="logo">
          <router-link
            to="/"
            tag="span"
            style="cursor: pointer"
            color="primary"
          >
            <v-img
              contain
              :src="require('../assets/images/logo.jpg')"
              height="100%"
              width="100px"
            ></v-img>
          </router-link>
        </div>
        <!-- <router-link to="/" tag="span" style="cursor:pointer" color="primary">Vinterest</router-link> -->
      </v-toolbar-title>

      <!-- search-input -->
      <v-text-field
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search posts in Vinterest"
        single-line
        rounded
        filled
        full-width
        class="mx-4"
        dense
        v-model="searchTerm"
        @input="handleSearchPosts"
        color="accent"
      ></v-text-field>

      <!-- search results cards -->
      <v-card v-if="searchResults.length" light id="search_card">
        <v-list dense>
          <v-list-item
            v-for="post in searchResults"
            :key="post._id"
            link
            @click="goToSearchedPost(post._id)"
          >
            <v-list-item-title>
              {{ post.title }}
              <span class="font-weight-thin ml-2">
                {{ formattedDescription(post.description) }}
              </span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>

      <v-btn text v-if="currentUser" to="/profile">
        <v-icon class="hidden-sm-only" left>mdi-account-box-outline</v-icon>
        <v-badge right color="blue darken-2" :class="{ bounce: badgeAnimated }">
          <span slot="badge" v-if="userFavorites.length">
            {{ userFavorites.length }}
          </span>
          Profile
        </v-badge>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SigninModal from "./Auth/SigninModal.vue";
import SignupModal from "./Auth/SignupModal.vue";

export default {
  data() {
    return {
      sidebarShown: false,
      sideBarSeletedItem: 0,
      authSnackbarShown: false,
      authErrorSnackbarShown: false,
      timeout: 5000,
      badgeAnimated: false,
      searchTerm: '',
      loginDialog: false,
      signupDialog: false
    }
  },
  components: {
    SigninModal,
    SignupModal
  },
  methods: {
    ...mapActions(['signoutUser', 'searchPosts']),
    handleSearchPosts() {
      this.searchPosts({
        searchTerm: this.searchTerm,
      })
    },
    goToSearchedPost(post_id) {
      this.searchTerm = ''
      this.$router.push(`/posts/${post_id}`)
      this.$store.commit('CLEAR_SEARCH_RESULTS')
    },
    formattedDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc
    },
    toggleModal() {
      this.loginDialog = !this.loginDialog
      this.signupDialog = !this.signupDialog
    }
  },
  computed: {
    ...mapGetters([
      'currentUser',
      'authError',
      'userFavorites',
      'searchResults',
    ]),
    sidebarItems() {
      let items = [
        { icon: 'mdi-chat-plus-outline', title: 'Posts', link: '/posts' }
      ]
      if (this.currentUser) {
        items = [
          { icon: 'mdi-chat-plus-outline', title: 'Posts', link: '/posts' },
          {
            icon: 'mdi-pencil-plus-outline',
            title: 'Create Post',
            link: '/post/add',
          },
          {
            icon: 'mdi-account-box-outline',
            title: 'Profile',
            link: '/profile',
          },
        ]
      }
      return items
    },
  },
  watch: {
    currentUser(val, oldVal) {
      if (!oldVal || !val) this.authSnackbarShown = true
    },
    authError(val, oldVal) {
      if (!oldVal) this.authErrorSnackbarShown = true
    },
    userFavorites(val) {
      if (val) {
        this.badgeAnimated = true
        setTimeout(() => (this.badgeAnimated = false), 1500)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>

#search_card
  position absolute
  width 100vw
  top 100%
  left 0
  color #fff
  background-color red

// bounce animation
.bounce
  animation bounce 1s both

@keyframes bounce
  0%, 20%, 53%, 80%, 100% {
    transform translate3d(0,0,0)
  }
  40%, 43% {
    transform translate3d(0,-20px,0)
  }
  70% {
    transform translate3d(0,-10px,0)
  }
  90% {
    transform translate3d(0,-4px,0)
  }
</style>
