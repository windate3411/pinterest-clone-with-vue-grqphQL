<template>
  <div>
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
            <v-icon left>mdi-exit-to-app</v-icon>
            <span>Sign Out</span>
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
    };
  },
  methods: {
    ...mapActions(["signoutUser"]),
  },
  computed: {
    ...mapGetters(["currentUser"]),
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
          {
            icon: "mdi-account-box-outline",
            title: "Profile",
            link: "/profile",
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
};
</script>
