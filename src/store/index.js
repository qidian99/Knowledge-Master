import Vue from 'vue'
import Vuex from 'vuex'
import setting from './modules/setting'
import topics from './modules/topics'
import auth from './modules/auth'
import edit from './modules/edit'
import user from './modules/user' // view other users
import posts from './modules/posts' // posts under topics
import post from './modules/post' // post related to user's browsing history
import option from './modules/option'
import chat from './modules/chat'
import createLogger from '../plugins/logger'
import createPersistedState from 'vuex-persistedstate'
import { REMOVE_COMMENT, REMOVE_POST } from './mutation-types'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    setting,
    topics,
    auth,
    posts,
    post,
    user,
    edit,
    option,
    chat,
  },
  strict: debug,
  // plugins: debug ? [createLogger()] : []
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        // removeItem: key => wx.clearStorage()
        removeItem: (key) => {}
      }
    })
  ],
  actions: {
    clearAll ({ commit }) {
      console.log('clearing all storage')
      commit('auth/reset')
      commit('post/reset')
      commit('posts/reset')
      commit('setting/reset')
      commit('topics/reset')
      commit('user/reset')
      commit('edit/reset')
      commit('option/reset')
      commit('chat/reset')
    },
    removeComment ({ commit, state }, { post, comment }) {
      commit(`posts/${REMOVE_COMMENT}`, { post, comment })
      commit(`post/${REMOVE_COMMENT}`, { post, comment })
    },
    removePost ({ commit, state }, post) {
      commit(`posts/${REMOVE_POST}`, post)
      commit(`post/${REMOVE_POST}`, post)
    }
  }
})
