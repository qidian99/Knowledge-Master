<template>
  <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfoClick">获取权限</button>
</template>

<script>
import { registerQuery } from '../utils/queries'

export default {
  data() {
    return {
    }
  },
  mounted() {
    self = this
    wx.login({
      async success(res) {
        console.log('WXAuthorize Mounted', res)
        if (res.code) {
          // 这里可以把code传给后台，后台用此获取openid及session_key
          console.log('Code', res.code)
          const payload = {
            query: registerQuery,
            variables: {
              code: res.code
            }
          }
          const r = await self.$http.post({
            payload
          })
          
          const {
            data: {
              registerOpenid: user
            }
          } = r

          console.log('Registered code:', r)

          // self.notifyUserInfo(user)
        }
      }
    })
  },
  methods: {
    getUserInfoClick() {
      // console.log('click事件首先触发')
    },
    bindGetUserInfo(e) {
      // console.log('回调事件后触发')
      const self = this
      if (e.mp.detail.userInfo) {
        let { encryptedData, userInfo, iv } = e.mp.detail
        console.log("同步用户资料", e.mp.detail, e.mp)
        self.notifyUserInfo(e.mp.detail.userInfo)

        // 后端处理
        // self.$http
        //   .post(api, {
        //     // 这里的code就是通过wx.login()获取的
        //     code: self.code,
        //     encryptedData,
        //     iv
        //   })
        //   .then(res => {
        //     console.log(`后台交互拿回数据:`, res)
        //     // 获取到后台重写的session数据，可以通过vuex做本地保存
        //   })
        //   .catch(err => {
        //     console.log(`api请求出错:`, err)
        //   })
      } else {
        //用户按了拒绝按钮
        console.log("用户按了拒绝按钮")
      }
    },
    notifyUserInfo (user) {
      console.log('notifyUserInfo', user)
      this.$emit('clickAuthorize', {
        user
      })
    }
  }
}
</script>

<style>
.user-status-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(38, 90, 233);
  background-color: #ffffff;
  padding: 5px 10px;
}
.user-status-user {
  color: black;
  flex: auto;
}
.user-status-message {
  color: black;
  flex: auto;
}
</style>