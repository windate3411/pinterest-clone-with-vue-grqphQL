import Vue from 'vue'
import Vuex from 'vuex'
import { defaultClient as apolloClient } from '../main.js'
import { GET_POSTS, USER_SIGNIN } from '../queries.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
  },
  mutations: {
    SET_POSTS: (state, payload) => {
      state.posts = payload
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload
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
        .then(({ data }) => {
          console.log(data.signinUser)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  modules: {},
  getters: {
    posts: (state) => state.posts,
    loading: (state) => state.loading,
  },
})
