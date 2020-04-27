export const registerQuery = `
mutation registerOpenid($code: String!) {
  registerOpenid(code: $code) {
    userId
    username
    password
    sessionKey
    openid
    avatarUrl
    language
    nickName
    gender
    country
    city
    province
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

