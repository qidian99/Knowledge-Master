const UserFragment = `
userId
username
nickName
avatarUrl
openid
subscription {
  topicId
  name
}`

export const registerQuery = `
mutation registerOpenid($code: String!) {
  registerOpenid(code: $code) {
    user {
      ${UserFragment}
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

const PostFragment2 = `
postId
title
body
createdAt
updatedAt
likes {
  ${UserFragment}
}
hide
user {
  ${UserFragment}
}
topic {
  topicId
  name
}
block`

const PostFragment = `
postId
title
body
createdAt
updatedAt
likes {
  userId
}
hide
user {
  ${UserFragment}
}
topic {
  topicId
  name
}
block
comments {
  user {
    ${UserFragment}
  }
  commentId
  body
  createdAt
  replyTo {
    post {
      postId
    }
  }
}`


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

export const createPostMutation = `
mutation createPost($topicId: ID! $title: String! $body: String!) {
  createPost(topicId: $topicId title: $title, body: $body) {
    ${PostFragment}
  }
}
`

export const likeAPostMutation = `
mutation likeAPost($postId: ID!) {
  likeAPost(postId: $postId) {
    userId
  }
}
`

const CommentFragment = `
commentId
body
block
user {
  ${UserFragment}
}
post {
  postId
  topic {
    topicId
  }
}
createdAt
updatedAt
`

export const createCommentMutation = `
mutation createComment($postId: ID! $body: String!) {
  createComment(postId: $postId body: $body) {
    ${CommentFragment}
  }
}
`

export const updateUserProfileMutation = `
mutation updateUserProfile($nickName: String!, $province: String!, $language: String!, $gender: Int!, 
  $country: String!, $city: String!, $avatarUrl: String!) {
  updateUserProfile(nickName: $nickName, province: $province, language: $language, gender: $gender, 
    country: $country, city: $city, avatarUrl: $avatarUrl) {
      ${UserFragment}
  } 
}
`

export const setUsernameMutation = `
mutation setUsername($username: String!) {
  setUsername(username: $username) {
      ${UserFragment}
  } 
}
`

export const subscribeToTopicMutation = `
mutation subscribeToTopic($topicId: ID!) {
  subscribeToTopic(topicId: $topicId) {
   ${UserFragment}
  }
}`
