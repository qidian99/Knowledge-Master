import { SET_USER_TOPIC } from '../mutation-types'

// initial state
const state = {
  topic: ''
}

// getters
const getters = {
  // process more
  topic: (state, getters, rootState) => {
    return state.topic
  }
}

// actions
const actions = {
  setUserTopic ({ commit, state }, topic) {
    commit(SET_USER_TOPIC, topic)
  }
}

// mutations
const mutations = {
  async [SET_USER_TOPIC] (state, topic) {
    state.topic = topic

    // update user subscription in backend
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
