<template>
  <v-app style="background-color:#E3E3EE">
    <Navbar />
    <v-main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
};
</script>

<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0;
  transform: translateX(-25px);
}
</style>
