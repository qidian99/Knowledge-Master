import { SET_USER_TOPIC } from '../mutation-types'

// initial state
const initialState = {
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
  },
  reset (state) {
    console.log('topics reset')
    state.topic = initialState.topic
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
