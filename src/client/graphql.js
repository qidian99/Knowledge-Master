import gql from 'graphql-tag'


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

export const registerQuery = gql`
mutation registerOpenid($code: String!) {
  registerOpenid(code: $code) {
    user {
      ${UserFragment}
    }
    token
  }
}`

export const testQuery = gql`query test {
  testUser {
    data
    message
  }
}`

export const topicsQuery = gql`query topics {
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


export const postsQueryWithTopic = gql`query posts($topicId: ID!) {
  posts(topicId: $topicId) {
    ${PostFragment}
  }
}`

export const postsQueryWithoutTopic = gql`query posts {
  posts {
    ${PostFragment}
  }
}`

export const createPostMutation = gql`
mutation createPost($topicId: ID! $title: String! $body: String! $images: [String]) {
  createPost(topicId: $topicId title: $title, body: $body, images: $images) {
    ${PostFragment}
  }
}
`

export const editPostMutation = gql`
mutation editPost($postId: ID! $title: String $body: String $images: [String]) {
  editPost(postId: $postId title: $title, body: $body, images: $images) {
    ${PostFragment}
  }
}
`

export const likeAPostMutation = gql`
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

export const createCommentMutation = gql`
mutation createComment($postId: ID! $body: String!) {
  createComment(postId: $postId body: $body) {
    ${CommentFragment}
  }
}
`

export const updateUserProfileMutation = gql`
mutation updateUserProfile($nickName: String!, $province: String!, $language: String!, $gender: Int!, 
  $country: String!, $city: String!, $avatarUrl: String!) {
  updateUserProfile(nickName: $nickName, province: $province, language: $language, gender: $gender, 
    country: $country, city: $city, avatarUrl: $avatarUrl) {
      ${UserFragment}
  } 
}
`

export const setUsernameMutation = gql`
mutation setUsername($username: String!) {
  setUsername(username: $username) {
      ${UserFragment}
  } 
}
`

export const subscribeToTopicMutation = gql`
mutation subscribeToTopic($topicId: ID!) {
  subscribeToTopic(topicId: $topicId) {
   ${UserFragment}
  }
}`

export const postQuery = gql`
query post($postId: ID!) {
  post(postId: $postId) {
    ${PostFragment}
  }
}`


export const deleteCommentMutation = gql`mutation deleteComment($commentId: ID!) {
  deleteComment(commentId: $commentId)
}`

export const deletePostMutation = gql`mutation deletePost($postId: ID!) {
  deletePost(postId: $postId)
}`

export const commentQuery = gql`query comment($commentId: ID!) {
  comment(commentId: $commentId) {
    commentId
  }
}`

export const findUserPostsQuery = gql`query findUserPosts {
  findUserPosts {
    ${PostFragment}
  }
}`

export const sendTemplateMutation = gql`mutation sendTemplate {
  sendTemplate
}`

export const addToGalleryMutation = gql`
mutation addToGallery($filepath: String!) {
  addToGallery(filepath: $filepath)
}`


export const deleteFromGalleryMutation = gql`
mutation deleteFromGallery($filepath: String!) {
  deleteFromGallery(filepath: $filepath)
}
`

export const deleteGalleryMutation = gql`
mutation deleteGallery {
  deleteGallery
}`

export const currentUserQuery = gql`
query currentUser {
  currentUser {
    ${UserFragment}
  }
}
`


const RoomFragment = `
roomId
chatterOne  {
  ...on User {
    ${UserFragment}
  }
}
chatterTwo  {
  ...on User {
    ${UserFragment}
  }
}
message {
  messageId
  content
  sender {
    ...on User {
      ${UserFragment}
    }
  }
  receiver  {
    ...on User {
      ${UserFragment}
    }
  }
  content
  createdAt
}
`

const MessageFragment = `
messageId
content
sender {
  ...on User {
    ${UserFragment}
  }
}
receiver  {
  ...on User {
    ${UserFragment}
  }
}
content
createdAt
room {
  roomId
  chatterOne  {
    ...on User {
      ${UserFragment}
    }
  }
  chatterTwo  {
    ...on User {
      ${UserFragment}
    }
  }
}
`

export const sendMessageMutation = gql`
 mutation sendMessage($receiverId: ID! $content: String!) {
   newMessage(receiverId: $receiverId content: $content) {
     ${MessageFragment}
   }
 }`

export const messagesQuery = gql`
 query messages($chatterId: ID!) {
   messages(chatterId: $chatterId) {
    ${MessageFragment}
   }
 }`

export const messageListQuery = gql`
 query messageList {
   messageList {
     ${RoomFragment}
   }
 }`


export const newMessageSubscription = gql`
subscription onNewMessage {
  newMessage {
    ${MessageFragment}
  }
}`

export const newPostSubscription = gql`
subscription {
  postAdded {
    ${PostFragment}
  }
}
`