import { SET_AUTH_TOKEN, SET_USER_PROFILE, SET_USER_GALLERY } from '../mutation-types'

// initial state
const initialState = {
  token: null,
  user: {}
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
  setAuthToken ({ commit, state }, tokenAndUser) {
    console.log(tokenAndUser)
    commit(SET_AUTH_TOKEN, tokenAndUser)
  },
  setUser ({ commit, state }, user) {
    commit(SET_USER_PROFILE, user)
  },
  setUserGallery ({ commit, state }, gallery) {
    commit(SET_USER_GALLERY, gallery)
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
    Object.keys(state.user).forEach(k => {
      state.user[k] = user[k]
    })
  },
  [SET_USER_GALLERY] (state, gallery) {
    console.log('setting user gallery', gallery)
    state.user.gallery = gallery
  },
  reset (state) {
    console.log('auth reset')
    state.token = initialState.token
    state.user = initialState.user
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
