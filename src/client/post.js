
import apolloClient from './index'
import {
  createPostMutation,
  editPostMutation,
  likeAPostMutation,
  createCommentMutation,
  setUsernameMutation,
  postQuery,
  deletePostMutation,
  deleteCommentMutation,
  sendTemplateMutation,
  findUserPostsQuery
} from './graphql'

import {
  removePost,
  updatePost,
  viewPost
} from '../utils/post'

export async function fetchPosts (query, topicId = null) {
  const operation = {
    query,
    variables: (topicId) ? { topicId } : null
  }
  const res = await apolloClient.query(operation)
  const {
    data: {
      posts
    }
  } = res
  console.log('Fetched posts', posts)
  return posts
}


export async function findUserPosts () {
  const operation = {
    query: findUserPostsQuery
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      findUserPosts
    }
  } = res

  console.log('Fetched posts', findUserPosts)
  return findUserPosts
}


export async function fetchPost (postId) {
  const self = this
  const operation = {
    query: postQuery,
    variables: {
      postId
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      post
    }
  } = res

  console.log('Fetched post', post)
  return post
}


export async function createPost (topicId, title, body, images) {
  console.log(topicId, title, body)
  const operation = {
    query: createPostMutation,
    variables: {
      topicId,
      title,
      body,
      images
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      createPost
    }
  } = res

  console.log('Created post', createPost)
  return createPost
}


export async function editPost (postId, title, body, images) {
  console.log(postId, title, body)
  const operation = {
    query: editPostMutation,
    variables: {
      postId,
      title,
      body,
      images
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      editPost
    }
  } = res

  console.log('Edited post', editPost)
  return editPost
}


export async function deletePost (postId) {
  console.log('deleting post')
  const operation = {
    query: deletePostMutation,
    variables: {
      postId
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      deletePost
    }
  } = res

  console.log('Deleted post', deletePost)
  return deletePost
}

export async function deleteComment (commentId) {
  console.log('deleting comment')
  const operation = {
    query: deleteCommentMutation,
    variables: {
      commentId
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      deleteComment
    }
  } = res

  console.log('Deleted comment', deleteComment)
  return deleteComment
}


export async function likeAPost (postId) {
  console.log('liking a post', postId)
  const operation = {
    query: likeAPostMutation,
    variables: {
      postId
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      likeAPost
    }
  } = res

  console.log('Liked post', likeAPost)
  return likeAPost
}

export async function createComment (postId, comment) {
  console.log('commenting a post', postId)
  const operation = {
    query: createCommentMutation,
    variables: {
      postId,
      body: comment
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      createComment
    }
  } = res

  console.log('Created comment', createComment)
  return createComment
}

export async function setUsername (username) {
  console.log('setting username', username)
  const operation = {
    query: setUsernameMutation,
    variables: {
      username
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      setUsername
    }
  } = res

  console.log('username set', setUsername)
  return setUsername
}

export async function sendTemplateMessage () {
  const operation = {
    query: sendTemplateMutation
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      sendTemplate
    }
  } = res

  console.log('set template', sendTemplate)
  return sendTemplate
}


// map actions:
// 1. viewPost
// 2. deletePost
// 3. updatePost
export async function clickPostAndNavigate (post) {
  try {
    let newPost
    let offlineMode = false
    if (!offlineMode) {
      newPost = await fetchPost(post.postId)
      // console.log('newPost', newPost)
      updatePost({ newPost, post }) // will check whether the post falls under the same category;
      console.log('post updated', newPost)

      if (!newPost) {
        // alert('帖子不存在')
        // console.log('No post available')
        removePost(post)
        wx.showToast({
          title: '帖子不存在',
          icon: 'loading',
          duration: 1200,
          mask: true
        })
      } else {
        // console.log('Navigating')
        viewPost(newPost)
        wx.navigateTo({
          url: '/pages/post/main'
        })
      }
    } else {
      // 离线浏览
      viewPost(post)
      wx.navigateTo({
        url: '/pages/post/main'
      })
    }
  } catch (err) {
    console.log(err)
  }
}
