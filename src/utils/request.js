import store from '../store'

export function getAuth () {
  return store.state.authorization.AUTH_STATE
}

function request (url, method, payload, header = {}) {
  wx.showLoading({
    title: '加载中' // loading
  })
  return new Promise((resolve, reject) => {
    let header = {
      'content-type': 'application/json'
    }

    if (method === 'POST') {
      // for graphql
      const token = store.state.auth.token
      console.log(
        'jwt token:',
        token
      )

      if (token) {
        header = {...header, authorization: `Bearer ${token}`}
      }

      console.log(header)
    }

    wx.request({
      url,
      method: method,
      data: payload,
      header,
      success: function (res) {
        wx.hideLoading()
        resolve(res.data)
      },
      fail: function (res) {
        wx.hideLoading()
        // reject(false)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
}

const host = process.env.API_BASE_URL
// const host = 'https://qidian.blue/wechat/api'

function get (obj) {
  return request(obj.url || host, 'GET', obj.payload)
}

function post (obj) {
  return request(obj.url || host, 'POST', obj.payload)
}

export default {
  request,
  get,
  post
}
