import { SET_OPTION_POST } from '../mutation-types'
import moment from 'moment'
import { deepCopy } from '../../utils'
// initial state
const initialState = {
  post: null,
}

// getters
const getters = {
  // process more
  post: (state, getters, rootState) => {
    return state.post
  },
}

// actions
const actions = {
  setOptionPost ({ commit, state }, post) {
    commit(SET_OPTION_POST, post)
  },
}

// mutations
const mutations = {
  [SET_OPTION_POST] (state, post) {
    console.log('In option post:', post)
    state.post = post
  },
  reset (state) {
    console.log('option post reset')
    state.post = initialState.post
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
