import Vue from 'vue'
import Vuex from 'vuex'
import setting from './modules/setting'
import topics from './modules/topics'
import auth from './modules/auth'
import posts from './modules/posts'
import createLogger from '../plugins/logger'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    setting,
    topics,
    auth,
    posts
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
  ]
})
