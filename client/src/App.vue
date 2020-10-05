<template>
  <v-app>
    <Navbar class="demo" />
    <v-main>
      <transition name="fade">
        <router-view v-if="isReloadAlive"></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
  },
  provide() {
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      isReloadAlive: true,
    }
  },
  methods: {
    reload() {
      this.isReloadAlive = false
      this.$nextTick(function() {
        this.isReloadAlive = true
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.demo
  z-index 205
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
