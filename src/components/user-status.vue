<template>
  <div class="user-status-container">
    <div class="user-status-user">用户：{{user}}</div>
    <div class="user-status-message">信息：{{message}}</div>
    <button class="user-status-btn" @click="getStatus">重新加载</button>
    <slot></slot>
  </div>
</template>

<script>
import { testQuery } from '../utils/queries'
export default {
  data () {
    return {
      user: '',
      message: ''
    }
  },
  created: async function () {
    // return http.post(self.baseUrl, requestObj, {options: headers}).then()
    this.getStatus()
  },
  methods: {
    getStatus: async function () {
      // const headers = {
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json'
      // }
      const baseURL = process.env.API_BASE_URL
      const payload = {
        query: testQuery
      }
      console.log('Sending request to', baseURL)

      const res = await this.$http.post({
        payload
      })

      console.log('User status:', res)

      const {
        data: {
          testUser: {
            data,
            message
          }
        }
      } = res

      this.user = data.user
      this.message = message
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