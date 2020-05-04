import {
  SET_USER_POST,
  SET_LIKES_OF_A_POST,
  SET_COMMENTS_OF_A_POST,
  SET_REFRESH,
  UPDATE_POST,
  REMOVE_POST,
  REMOVE_COMMENT
} from '../mutation-types'
import { deepCopy } from '../../utils'
import moment from 'moment'

// initial state
const initialState = {
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
  },
  updatePost ({ commit, state }, {newPost, post}) {
    if (!newPost) {
      commit(REMOVE_POST, post)
    } else {
      commit(UPDATE_POST, newPost)
    }
  },
  removePost ({ commit, state }, post) {
    commit(REMOVE_POST, post)
  },
  removeComment ({ commit, state }, { post, comment }) {
    commit(REMOVE_COMMENT, { post, comment })
  }
}

// mutations
const mutations = {
  [SET_REFRESH] (state, refresh) {
    state.refresh = refresh
  },
  [SET_USER_POST] (state, posts) {
    console.log('In set user posts:', posts)
    state.posts = initialState.posts
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
      return post.postId === postId
    })
    if (!post) return
    post.comments = comments
    post.updatedAt = moment().valueOf()
  },
  [UPDATE_POST] (state, newPost) {
    const {
      postId
    } = newPost
    const index = state.posts.findIndex((post, index) => {
      return post.postId === postId
    })
    if (index === -1) {
      // do something

    } else {
      console.log('Found post to update', state.posts[index])
      if (newPost.updatedAt !== state.posts[index].updatedAt) {
        state.posts[index] = newPost
        // comparing the updated at and set the refresh
        state.refresh = true
      } else {
        console.log('Post not updated b/c they are the same')
      }
    }
  },
  [REMOVE_POST] (state, post) {
    const {
      postId
    } = post
    const index = state.posts.findIndex((post, index) => {
      return post.postId === postId
    })
    if (index === -1) {
      // do something

    } else {
      console.log('Found post to delete', state.posts[index])
      state.posts.splice(index, 1)
    }
  },
  [REMOVE_COMMENT] (state, { post, comment }) {
    const {
      postId
    } = post
    const index = state.posts.findIndex((post, index) => {
      return post.postId === postId
    })
    if (index === -1) {
      // do something

    } else {
      const target = deepCopy(state.posts[index])
      console.log('Found post with comments', target.comments)
      const i = target.comments.findIndex((c, index) => c.commentId === comment.commentId)
      if (i !== -1) {
        target.comments.splice(i, 1)
        target.updatedAt = moment().valueOf()
      }
      state.posts.splice(index, 1, target)
    }
  },
  reset (state) {
    console.log('posts reset')
    state.posts = initialState.posts
    state.refresh = initialState.refresh
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
