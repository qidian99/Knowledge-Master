const UserFragment = `
userId
username
nickName
avatarUrl
openid
subscription {
  topicId
  name
}
gallery`

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
images
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
mutation createPost($topicId: ID! $title: String! $body: String! $images: [String]) {
  createPost(topicId: $topicId title: $title, body: $body, images: $images) {
    ${PostFragment}
  }
}
`

export const editPostMutation = `
mutation editPost($postId: ID! $title: String $body: String $images: [String]) {
  editPost(postId: $postId title: $title, body: $body, images: $images) {
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

export const postQuery = `
query post($postId: ID!) {
  post(postId: $postId) {
    ${PostFragment}
  }
}`


export const deleteCommentMutation = `mutation deleteComment($commentId: ID!) {
  deleteComment(commentId: $commentId)
}`

export const deletePostMutation = `mutation deletePost($postId: ID!) {
  deletePost(postId: $postId)
}`

export const commentQuery = `query comment($commentId: ID!) {
  comment(commentId: $commentId) {
    commentId
  }
}`

export const findUserPostsQuery = `query findUserPosts {
  findUserPosts {
    ${PostFragment}
  }
}`

export const sendTemplateMutation = `mutation sendTemplate {
  sendTemplate
}`

export const addToGalleryMutation = `
mutation addToGallery($filepath: String!) {
  addToGallery(filepath: $filepath)
}`


export const deleteFromGalleryMutation = `
mutation deleteFromGallery($filepath: String!) {
  deleteFromGallery(filepath: $filepath)
}
`

export const deleteGalleryMutation = `
mutation deleteGallery {
  deleteGallery
}`

export const currentUserQuery = `
query currentUser {
  currentUser {
    ${UserFragment}
  }
}
`
