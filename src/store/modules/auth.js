import { SET_AUTH_TOKEN } from '../mutation-types'

// initial state
const state = {
  token: null,
}

// getters
const getters = {
  // process more
  token: (state, getters, rootState) => {
    return state.token
  }
}

// actions
const actions = {
  setToken ({ commit, state, token }) {
    console.log(token)
    commit(SET_AUTH_TOKEN, token)
  }
}

// mutations
const mutations = {
  [SET_AUTH_TOKEN] (state, token) {
    console.log('setting auth token', token)
    state.token = token
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
