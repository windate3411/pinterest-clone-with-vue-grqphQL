import Vue from 'vue'
import Vuex from 'vuex'
import { defaultClient as apolloClient } from '../main.js'
import { GET_POSTS, USER_SIGNIN, GET_CURRENT_USER } from '../queries.js'
import router from '../router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
    currentUser: null,
  },
  mutations: {
    SET_POSTS: (state, payload) => {
      state.posts = payload
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload
    },
    SET_CURRENT_USER: (state, payload) => {
      state.currentUser = payload
    },
  },
  actions: {
    getPosts: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: GET_POSTS,
        })
        .then(({ data }) => {
          commit('SET_POSTS', data.getPosts)
          commit('SET_LOADING', false)
        })
        .catch((err) => {
          console.log(err)
          commit('SET_LOADING', false)
        })
    },
    signinUser: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: USER_SIGNIN,
          variables: payload,
        })
        .then(async ({ data }) => {
          localStorage.setItem('token', data.signinUser.token)
          await router.go()
          await router.push('/')
          console.log(data.signinUser)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getCurrentUser: ({ commit }) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: GET_CURRENT_USER,
        })
        .then(({ data }) => {
          commit('SET_LOADING', false)
          commit('SET_CURRENT_USER', data.getCurrentUser)
          console.log(data.getCurrentUser)
        })
        .catch((err) => {
          commit('SET_LOADING', false)
          console.log(err)
        })
    },
    signoutUser: async ({ commit }) => {
      commit('SET_CURRENT_USER', null)
      localStorage.setItem('token', '')
      // end apollo session
      await apolloClient.resetStore()
      router.push('/signin')
    },
  },
  modules: {},
  getters: {
    posts: (state) => state.posts,
    loading: (state) => state.loading,
    currentUser: (state) => state.currentUser,
  },
})
