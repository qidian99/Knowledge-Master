<template>
  <div class="user-status-container">
    <div class="user-status-user">用户：{{user}}</div>
    <div class="user-status-message">信息: {{message}}</div>
    <button class="user-status-btn" @click="getStatus">重新加载</button>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: '',
      status: ''
    }
  },
  created: async function () {
    // return http.post(self.baseUrl, requestObj, {options: headers}).then()
    this.getStatus()
  },
  methods: {
    getStatus: function () {
      const testQuery = `query test {
    testUser {
      data
      message
    }
  }`
      // const headers = {
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json'
      // }
      const baseURL = process.env.API_BASE_URL
      const payload = {
        query: testQuery
      }
      console.log('Sending request to', baseURL)

      console.log('POST', this.$http.post)

      this.$http.post({
        // url: baseURL,
        data: payload
      }).then(function (res) {
        console.log('Res:', res)
        return res.json()
      }).then(function (data) {
        console.log('User status:', data)
      })
    }
  }
}
</script>

<style>
.user-status-container {
  display: flex;
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