import { SET_AUTH_TOKEN, SET_USER_PROFILE } from '../mutation-types'

// initial state
const state = {
  token: null,
  user: 'null'
}

// getters
const getters = {
  // process more
  token: (state, getters, rootState) => {
    return state.token
  },
  user: (state, getters, rootState) => {
    return state.user
  }
}

// actions
const actions = {
  setToken ({ commit, state }, tokenAndUser) {
    console.log(tokenAndUser)
    commit(SET_AUTH_TOKEN, tokenAndUser)
  },
  setUser ({ commit, state }, user) {
    console.log('setting user profile', user)
    commit(SET_USER_PROFILE, user)
  }
}

// mutations
const mutations = {
  [SET_AUTH_TOKEN] (state, { token, user }) {
    console.log('setting auth token', token, user)
    state.token = token
    state.user = user
  },
  [SET_USER_PROFILE] (state, user) {
    console.log('setting user profile', user)
    state.user = user || {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
