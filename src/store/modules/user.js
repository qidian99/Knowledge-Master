import { SET_VIEW_OTHER_USER } from '../mutation-types'
// initial state
const initialState = {
  otherUser: {}
}

// getters
const getters = {
  // process more
  otherUser: (state, getters, rootState) => {
    return state.otherUser
  }
}

// actions
const actions = {
  setViewOtherUser ({ commit, state }, user) {
    commit(SET_VIEW_OTHER_USER, user)
  }
}

// mutations
const mutations = {
  [SET_VIEW_OTHER_USER] (state, user) {
    state.otherUser = user
  },
  reset (state) {
    console.log('user reset')
    state.otherUser = initialState.otherUser
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
