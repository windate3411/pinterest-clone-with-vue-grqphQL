import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Posts from '../components/Posts/Posts.vue'
import AddPost from '../components/Posts/AddPost.vue'
import Profile from '../components/Auth/Profile.vue'
import Signin from '../components/Auth/Signin.vue'
import Signup from '../components/Auth/Signup.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/posts',
    name: 'Posts',
    component: Posts,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/post/add',
    name: 'AddPost',
    component: AddPost,
  },
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes,
})

export default router
