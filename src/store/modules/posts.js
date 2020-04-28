import { SET_USER_POST } from '../mutation-types'

// initial state
const state = {
  posts: {}
}

// getters
const getters = {
  // process more
  posts: (state, getters, rootState) => {
    return state.posts
  }
}

// actions
const actions = {
  setPosts ({ commit, state }, posts) {
    commit(SET_USER_POST, posts)
  }
}

// mutations
const mutations = {
  [SET_USER_POST] (state, posts) {
    console.log("In set user posts:", posts)
    state.posts = posts
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
