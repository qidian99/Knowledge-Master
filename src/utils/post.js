import http from './request'
import {
  createPostMutation,
  likeAPostMutation,
  createCommentMutation,
  setUsernameMutation,
  postQuery,
  deletePostMutation,
  deleteCommentMutation,
  sendTemplateMutation,
  findUserPostsQuery
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

export async function findUserPosts () {
  const self = this
  const payload = {
    query: findUserPostsQuery
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      findUserPosts
    }
  } = r

  console.log('Fetched posts', findUserPosts)
  return findUserPosts
}


export async function fetchPost (postId) {
  const self = this
  const payload = {
    query: postQuery,
    variables: {
      postId
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      post
    }
  } = r

  console.log('Fetched post', post)
  return post
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


export async function deletePost (postId) {
  console.log('deleting post')
  const payload = {
    query: deletePostMutation,
    variables: {
      postId
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      deletePost
    }
  } = r

  console.log('Deleted post', deletePost)
  return deletePost
}

export async function deleteComment (commentId) {
  console.log('deleting comment')
  const payload = {
    query: deleteCommentMutation,
    variables: {
      commentId
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      deleteComment
    }
  } = r

  console.log('Deleted comment', deleteComment)
  return deleteComment
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

export async function sendTemplateMessage () {
  const payload = {
    query: sendTemplateMutation
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      sendTemplate
    }
  } = r

  console.log('set template', sendTemplate)
  return sendTemplate
}


// map actions:
// 1. viewPost
// 2. deletePost
// 3. updatePost
export async function clickPostAndNavigate (self, post) {
  let newPost
  let offlineMode = false
  if (!offlineMode) {
    newPost = await fetchPost(post.postId)
    console.log('newPost', newPost)
    self.updatePost({ newPost, post }) // will check whether the post falls under the same category;
    if (!newPost) {
      // alert('帖子不存在')
      self.removePost(post)
      wx.showToast({
        title: '帖子不存在',
        icon: 'loading',
        duration: 1200,
        mask: true
      })
    } else {
      if (self.viewPost) { // remember to refactor this
        self.viewPost(newPost)
        wx.navigateTo({
          url: '/pages/post/main'
        })
      }
    }
  } else {
    // 离线浏览
    self.viewPost(post)
    wx.navigateTo({
      url: '/pages/post/main'
    })
  }
}
