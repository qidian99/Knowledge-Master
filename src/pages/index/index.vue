<template>
  <div class="container" @click="clickHandle">
    <div class="message">{{msg}}</div>
    <ClickCounter :init-num='10' @clicknum="handleClickNum" />
    <UserStatus />
    <!-- <WXAuthorize /> -->
    <!-- <ClickCounter :init-num='30' @clicknum="handleClickNum" /> -->
  </div>
</template>

<script>
import ClickCounter from '@/components/click-counter'
import UserStatus from '@/components/user-status'
import WXAuthorize from '@/components/wx-authorize'
import { registerQuery } from '@/utils/queries'

export default {
  components: { ClickCounter, UserStatus, WXAuthorize },
  data () {
    return {
      msg: 'Hello'
    }
  },
  created() {
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
    clickHandle () {
      this.msg = 'Clicked!!!!!!'
    },
    handleClickNum (data) {
      console.log('>>>>', data.num)
    }
  }
}
</script>

<style scoped>
.message {
  color: red;
  padding: 10px;
  text-align: center;
}
</style>