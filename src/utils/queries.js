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

const PostFragment = `
postId
title
body
createdAt
updatedAt
likes
hide
user {
  userId
  openid
  username
}
topic {
  topicId
  name
}
block`


export const postsQueryWithTopic = `query posts($topicId: ID!) {
  posts(topicId: $topicId) {
  	${PostFragment}
  }
}`

export const postsQueryWithoutTopic = `query posts {
  posts {
  	${PostFragment}
  }
}`

