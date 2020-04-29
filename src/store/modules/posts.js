import { SET_USER_POST, SET_LIKES_OF_A_POST, SET_COMMENTS_OF_A_POST, SET_REFRESH} from '../mutation-types'
import { deepCopy } from '../../utils'

// initial state
const state = {
  posts: [],
  refresh: false
}

// getters
const getters = {
  // process more
  posts: (state, getters, rootState) => {
    return state.posts
  }
}

// actions
const actions = {
  setPosts ({ commit, state }, posts) {
    commit(SET_USER_POST, posts)
    commit(SET_REFRESH, true)
  },
  setLikesOfAPost ({ commit, state }, { postId, likes }) {
    console.log('setting likes of a post', likes)
    commit(SET_LIKES_OF_A_POST, { postId, likes })
    commit(SET_REFRESH, true)
  },
  setCommentsOfAPost ({ commit, state }, { postId, comments }) {
    console.log('setting comments of a post', comments)
    commit(SET_COMMENTS_OF_A_POST, { postId, comments })
    commit(SET_REFRESH, true)
  },
  setRefresh ({ commit, state }, refresh) {
    commit(SET_REFRESH, refresh)
  }
}

// mutations
const mutations = {
  [SET_REFRESH] (state, refresh) {
    state.refresh = refresh
  },
  [SET_USER_POST] (state, posts) {
    console.log('In set user posts:', posts)
    state.posts = posts
  },
  [SET_LIKES_OF_A_POST] (state, { postId, likes }) {
    const post = state.posts.find((post, index) => {
      console.log(index, post, post.postId, postId, post.postId === postId, post.postId === postId)
      return post.postId === postId
    })
    if (!post) return
    post.likes = likes
    // const index = state.posts.findIndex((post, index) => {
    //   console.log(index, post, post.postId, postId, post.postId == postId, post.postId === postId)
    //   return post.postId == postId
    // })
    // if (index === -1) return
    // const tempPost = { ...state.posts[index], likes }
    // let tempPosts = deepCopy(state.posts)
    // tempPosts = tempPosts.slice(0, index).concat(tempPost).concat(tempPosts.slice(index + 1))
    // console.log('tempPosts', tempPosts)
    // state.posts = tempPosts
  },
  [SET_COMMENTS_OF_A_POST] (state, { postId, comments }) {
    const post = state.posts.find((post, index) => {
      console.log(index, post, post.postId, postId, post.postId == postId, post.postId === postId)
      return post.postId == postId
    })
    if (!post) return
    post.comments = comments
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
