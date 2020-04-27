function request (url, method, payload, header = {}) {
  wx.showLoading({
    title: '加载中' // loading
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: method,
      data: payload,
      headers: {
        'content-type': 'application/json'
      },
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
