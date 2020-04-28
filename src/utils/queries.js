export const registerQuery = `
mutation registerOpenid($code: String!) {
  registerOpenid(code: $code) {
    user {
      userId
      username
      sessionKey
      openid
    }
    token
  }
}`

export const testQuery = `query test {
  testUser {
    data
    message
  }
}`

export const topicsQuery = `query topics {
  topics {
    topicId
    name
  }
}`

