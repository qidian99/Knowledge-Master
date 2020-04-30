import { SET_HISTORY_POST, VIEW_POST, REMOVE_POST, SET_LIKES_OF_A_POST, REMOVE_COMMENT, ADD_COMMENT } from '../mutation-types'
import moment from 'moment'
import { deepCopy } from '../../utils'
// initial state
const initialState = {
  post: {},
  history: []
}

// getters
const getters = {
  // process more
  post: (state, getters, rootState) => {
    return state.post
  },
  history: (state, getters, rootState) => {
    return state.history
  }
}

// actions
const actions = {
  viewPost ({ commit, state }, post) {
    commit(VIEW_POST, post)
    commit(SET_HISTORY_POST, post)
  },
  addComment ({ commit, state }, comment) {
    commit(ADD_COMMENT, comment)
  }
}

// mutations
const mutations = {
  [VIEW_POST] (state, post) {
    console.log('In view post:', post)
    state.post = post
  },
  [SET_HISTORY_POST] (state, post) {
    const temp = [...state.history]
    const found = temp.findIndex((p) => p.postId === post.postId)
    if (found !== -1) {
      temp.splice(found, 1)
    }
    temp.unshift({...post, timestamp: moment()})
    console.log('In set history post:', temp)
    state.history = temp
  },
  [REMOVE_COMMENT] (state, { post, comment }) {
    const {
      postId
    } = post

    if (state.post.postId !== post.postId) {
      return
    }

    const target = state.post
    const tempComments = deepCopy(target.comments)
    const i = tempComments.findIndex((c, index) => c.commentId === comment.commentId)
    if (i !== -1) {
      tempComments.splice(i, 1)
    }
    state.post.comments = tempComments
  },
  [ADD_COMMENT] (state, comment) {
    state.post.comments.unshift(comment)
  },
  [REMOVE_POST] (state, post) {
    const {
      postId
    } = post
    const index = state.history.findIndex((p, index) => {
      return p.postId === postId
    })
    if (index === -1) {
      // do something

    } else {
      console.log('Found post to delete', state.history[index])
      state.history.splice(index, 1)
    }
  },
  reset (state) {
    console.log('post reset')
    state.post = initialState.post
    state.history = initialState.history
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
