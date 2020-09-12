import Vue from 'vue'
import Vuex from 'vuex'
import { gql } from 'apollo-boost'
import { defaultClient as apolloClient } from '../main.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
  },
  mutations: {
    SET_POSTS: (state, payload) => {
      state.posts = payload
    },
  },
  actions: {
    getPosts: ({ commit }) => {
      apolloClient
        .query({
          query: gql`
            query {
              getPosts {
                _id
                title
                description
                imgUrl
              }
            }
          `,
        })
        .then(({ data }) => {
          commit('SET_POSTS', data.getPosts)
          console.log(data.getPosts)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  modules: {},
  getters: {
    posts: (state) => state.posts,
  },
})
