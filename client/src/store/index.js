import Vue from 'vue'
import Vuex from 'vuex'
import { defaultClient as apolloClient } from '../main.js'
import {
  GET_POSTS,
  USER_SIGNIN,
  GET_CURRENT_USER,
  USER_SIGNUP,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  GET_POST,
  INFINITE_SCROLL_POSTS,
} from '../queries.js'
import router from '../router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    loading: false,
    currentUser: null,
    error: null,
    authError: null,
    searchResults: [],
    sharingModal: false,
  },
  mutations: {
    SET_POSTS: (state, payload) => {
      state.posts = payload
    },
    SET_USER_POSTS: (state, payload) => {
      state.userPosts = payload
    },
    SET_LOADING: (state, payload) => {
      state.loading = payload
    },
    SET_CURRENT_USER: (state, payload) => {
      state.currentUser = payload
    },
    SET_ERROR: (state, payload) => {
      state.error = payload
    },
    SET_AUTH_ERROR: (state, payload) => {
      state.authError = payload
    },
    SET_SEARCH_RESULTS: (state, payload) => {
      state.searchResults = payload
    },
    CLEAR_SEARCH_RESULTS: (state) => {
      state.searchResults = []
    },
    SET_SIGNIN_DIALOG: (state) => {
      state.signinDialogShown = !state.signinDialogShown
    },
    SET_SIGNUP_DIALOG: (state) => {
      state.signupDialogShown = !state.signupDialogShown
    },
    SET_SHARING_MODAL: (state) => {
      state.sharingModal = !state.sharingModal
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
    getUserPosts: ({ commit }, payload) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          commit('SET_USER_POSTS', data.getUserPosts)
          commit('SET_LOADING', false)
        })
        .catch((err) => {
          console.log(err)
          commit('SET_LOADING', false)
        })
    },
    searchPosts: ({ commit }, payload) => {
      commit('SET_LOADING', true)
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          console.log('search results', data.searchPosts)
          commit('SET_SEARCH_RESULTS', data.searchPosts)
          commit('SET_LOADING', false)
        })
        .catch((err) => {
          console.log(err)
          commit('SET_LOADING', false)
        })
    },
    addPost: ({ commit }, payload) => {
      commit('SET_LOADING', true)
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // read the query to be updated
            const data = cache.readQuery({
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 30,
              },
            })

            // update data
            data.infiniteScrollPosts.posts.unshift(addPost)

            // write updated data into query
            cache.writeQuery({
              query: INFINITE_SCROLL_POSTS,
              data,
            })
          },
          // add optimistic response
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              ...payload,
              __typename: 'Post',
              _id: -1,
            },
          },
        })
        .then(({ data }) => {
          router.go()
          commit('SET_LOADING', false)
        })
        .catch((err) => {
          console.log(err)
          commit('SET_LOADING', false)
        })
    },
    likePost: ({ commit, state }, payload) => {
      commit('SET_LOADING', true)
      apolloClient
        .mutate({
          mutation: LIKE_POST,
          variables: payload,
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: payload,
            })
            data.getPost.likes += 1
            cache.writeQuery({
              query: GET_POST,
              variables: payload,
              data,
            })
          },
        })
        .then(({ data }) => {
          const updatedUser = {
            ...state.currentUser,
            favorites: data.likePost.favorites,
          }
          commit('SET_CURRENT_USER', updatedUser)
        })
        .catch((err) => console.log(err))
    },
    unLikePost: ({ commit, state }, payload) => {
      commit('SET_LOADING', true)
      apolloClient
        .mutate({
          mutation: UNLIKE_POST,
          variables: payload,
          update: (cache, { data: { unLikePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: payload,
            })
            data.getPost.likes -= 1
            cache.writeQuery({
              query: GET_POST,
              variables: payload,
              data,
            })
          },
        })
        .then(({ data }) => {
          const updatedUser = {
            ...state.currentUser,
            favorites: data.unLikePost.favorites,
          }
          commit('SET_CURRENT_USER', updatedUser)
        })
        .catch((err) => console.log(err))
    },
    signinUser: ({ commit }, payload) => {
      // reset error
      commit('SET_ERROR', null)

      // reset token
      localStorage.setItem('token', '')

      // set loading when logingin
      commit('SET_LOADING', true)

      apolloClient
        .mutate({
          mutation: USER_SIGNIN,
          variables: payload,
        })
        .then(async ({ data }) => {
          localStorage.setItem('token', data.signinUser.token)
          commit('SET_LOADING', false)
          await router.go()
          console.log(data.signinUser)
        })
        .catch((err) => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
          console.log(err)
        })
    },
    signupUser: ({ commit }, payload) => {
      // reset error
      commit('SET_ERROR', null)

      // reset token
      localStorage.setItem('token', '')

      // set loading when signing up
      commit('SET_LOADING', true)

      apolloClient
        .mutate({
          mutation: USER_SIGNUP,
          variables: payload,
        })
        .then(async ({ data }) => {
          localStorage.setItem('token', data.signupUser.token)
          commit('SET_LOADING', false)
          await router.go()
          console.log(data.signupUser)
        })
        .catch((err) => {
          commit('SET_LOADING', false)
          commit('SET_ERROR', err)
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
    },
    toggleSharingModal: ({ commit }) => {
      commit('SET_SHARING_MODAL')
    },
  },
  modules: {},
  getters: {
    posts: (state) => state.posts.slice(0, 5),
    userPosts: (state) => state.userPosts,
    loading: (state) => state.loading,
    currentUser: (state) => state.currentUser,
    error: (state) => state.error,
    authError: (state) => state.authError,
    userFavorites: (state) => state.currentUser && state.currentUser.favorites,
    searchResults: (state) => state.searchResults,
    sharingModal: (state) => state.sharingModal,
  },
})
