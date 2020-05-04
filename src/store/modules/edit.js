import { SET_EDIT_POST } from '../mutation-types'
import moment from 'moment'
import { deepCopy } from '../../utils'
// initial state
const initialState = {
  post: {},
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
  editPost ({ commit, state }, post) {
    commit(SET_EDIT_POST, post)
  },
}

// mutations
const mutations = {
  [SET_EDIT_POST] (state, post) {
    console.log('In edit post:', post)
    state.post = post
  },
  reset (state) {
    console.log('edit post reset')
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
