<template>
  <div>
    <v-app-bar color="primary" dense dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer"
          >Vinterest</router-link
        >
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
      <v-menu offset-y="true" transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" color="white">
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
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navItems: [
        { icon: 'mdi-chat-plus-outline', title: 'Posts', link: '/posts' },
        { icon: 'mdi-login', title: 'Sign In', link: '/signin' },
        { icon: 'mdi-lead-pencil', title: 'Sign Up', link: '/signup' },
      ],
    }
  },
}
</script>
