import http from './request'
import {
  createPostMutation,
  likeAPostMutation,
  createCommentMutation,
  setUsernameMutation
} from './queries'


export async function fetchPosts (query, topicId = null) {
  const self = this
  const payload = {
    query,
    variables: (topicId) ? { topicId } : null
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      posts
    }
  } = r

  console.log('Fetched posts', posts)
  return posts
}

export async function createPost (topicId, title, body) {
  console.log(topicId, title, body)
  const payload = {
    query: createPostMutation,
    variables: {
      topicId,
      title,
      body
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      createPost
    }
  } = r

  console.log('Created post', createPost)
  return createPost
}


export async function likeAPost (postId) {
  console.log('liking a post', postId)
  const payload = {
    query: likeAPostMutation,
    variables: {
      postId
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      likeAPost
    }
  } = r

  console.log('Liked post', likeAPost)
  return likeAPost
}

export async function createComment (postId, comment) {
  console.log('commenting a post', postId)
  const payload = {
    query: createCommentMutation,
    variables: {
      postId,
      body: comment
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      createComment
    }
  } = r

  console.log('Created comment', createComment)
  return createComment
}

export async function setUsername (username) {
  console.log('setting username', username)
  const payload = {
    query: setUsernameMutation,
    variables: {
      username
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      setUsername
    }
  } = r

  console.log('username set', setUsername)
  return setUsername
}