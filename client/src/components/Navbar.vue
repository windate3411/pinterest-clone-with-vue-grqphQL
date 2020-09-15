<template>
  <div>
    <!-- auth snackbar -->
    <v-snackbar v-model="authSnackbarShown" :timeout="timeout" color="success">
      <v-icon left>mdi-check</v-icon>
      <span>You've successfully signed in!</span>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="authSnackbarShown = false">X</v-btn>
      </template>
    </v-snackbar>

    <!-- auth error snackbar -->
    <v-snackbar v-model="authErrorSnackbarShown" :timeout="timeout" color="error" v-if="authError">
      <v-icon left>mdi-cancel</v-icon>
      <span>{{authError.message}}</span>
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="authErrorSnackbarShown = false">X</v-btn>
      </template>
    </v-snackbar>

    <!-- sidebar -->
    <v-navigation-drawer app temporary fixed v-model="sidebarShown">
      <v-app-bar color="accent" dense text>
        <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor:pointer">
          <h1 class="title white--text text--darken-4 pl-5">Vinterest</h1>
        </router-link>
      </v-app-bar>

      <!-- side-bar-links -->
      <v-list rounded class="mt-5">
        <v-list-item-group v-model="sideBarSeletedItem" color="primary">
          <v-list-item v-for="(item, i) in sidebarItems" :key="i" :to="item.link">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="mt-2" v-if="currentUser" @click="signoutUser">
            <v-list-item-icon>
              <v-icon v-text="'mdi-exit-to-app'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="'Sign Out'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- nav -->
    <v-app-bar color="primary" dense dark>
      <v-app-bar-nav-icon @click="sidebarShown = !sidebarShown"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer">Vinterest</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- search-input -->
      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        placeholder="Search posts"
        single-line
        color="accent"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn text v-if="currentUser" to="/profile">
        <v-icon class="hidden-sm-only" left>mdi-account-box-outline</v-icon>
        <v-badge right color="blue darken-2" :class="{'bounce':badgeAnimated}">
          <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
          Profile
        </v-badge>
      </v-btn>
      <!-- right-side-menu -->
      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" color="white" class="hidden-sm-and-down">
            <v-icon left>mdi-chevron-down</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="item in navItems" :key="item.id" :to="item.link">
            <v-list-item-title>
              <v-icon left>{{ item.icon }}</v-icon>
              <span>{{ item.title }}</span>
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item v-if="currentUser" @click="signoutUser">
            <v-icon left class="hidden-sm-and-down">mdi-exit-to-app</v-icon>
            <span>Sign Out</span>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      sidebarShown: false,
      sideBarSeletedItem: 0,
      authSnackbarShown: false,
      authErrorSnackbarShown: false,
      timeout: 5000,
      badgeAnimated: false,
    };
  },
  methods: {
    ...mapActions(["signoutUser"]),
  },
  computed: {
    ...mapGetters(["currentUser", "authError", "userFavorites"]),
    navItems() {
      let items = [
        { icon: "mdi-chat-plus-outline", title: "Posts", link: "/posts" },
        { icon: "mdi-login", title: "Sign In", link: "/signin" },
        { icon: "mdi-lead-pencil", title: "Sign Up", link: "/signup" },
      ];

      if (this.currentUser) {
        items = [
          { icon: "mdi-chat-plus-outline", title: "Posts", link: "/posts" },
          {
            icon: "mdi-pencil-plus-outline",
            title: "Create Post",
            link: "/post/add",
          },
        ];
      }
      return items;
    },
    sidebarItems() {
      let items = [
        { icon: "mdi-chat-plus-outline", title: "Posts", link: "/posts" },
        { icon: "mdi-login", title: "Sign In", link: "/signin" },
        { icon: "mdi-lead-pencil", title: "Sign Up", link: "/signup" },
      ];
      if (this.currentUser) {
        items = [
          { icon: "mdi-chat-plus-outline", title: "Posts", link: "/posts" },
          {
            icon: "mdi-pencil-plus-outline",
            title: "Create Post",
            link: "/post/add",
          },
          {
            icon: "mdi-account-box-outline",
            title: "Profile",
            link: "/profile",
          },
        ];
      }
      return items;
    },
  },
  watch: {
    currentUser(val, oldVal) {
      if (!oldVal) this.authSnackbarShown = true;
    },
    authError(val, oldVal) {
      if (!oldVal) this.authErrorSnackbarShown = true;
    },
    userFavorites(val) {
      if (val) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1500);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

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