import { UPDATE_USER_INFO } from '../mutation-types'

// initial state
const state = {
  items: [],
  userInfo: null
}

// getters
const getters = {
  // process more
  userInfo: (state, getters, rootState) => {
    return state.userInfo
  }
}

// actions
const actions = {
  updateUserInfo ({ commit, state }, userInfo) {
    const savedCartItems = [...state.items]
    commit(UPDATE_USER_INFO, userInfo)
  }
}

// mutations
const mutations = {
  [UPDATE_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
