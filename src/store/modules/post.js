import { SET_HISTORY_POST, VIEW_POST, SET_LIKES_OF_A_POST } from '../mutation-types'

// initial state
const state = {
  post: null,
  history: []
}

// getters
const getters = {
  // process more
  post: (state, getters, rootState) => {
    return state.post
  }
}

// actions
const actions = {
  viewPost ({ commit, state }, post) {
    commit(VIEW_POST, post)
    commit(SET_HISTORY_POST, post)
  }
}

// mutations
const mutations = {
  [VIEW_POST] (state, post) {
    console.log("In view post:", post)
    state.post = post
  },
  [SET_HISTORY_POST] (state, post) {
    console.log("In set history post:", post)
    const temp = [...state.history]
    const found = temp.findIndex((p) => p.postId === post.postId)
    if (found) {
      temp.splice(found, 1);
    }
    temp.push(0, post)
    state.history = temp
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}