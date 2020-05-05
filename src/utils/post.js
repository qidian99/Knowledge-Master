
import store from '../store'

export const removePost = (post) => {
  store.dispatch('removePost', post)
}

export const updatePost = ({ newPost, post }) => {
  store.dispatch('posts/updatePost', { newPost, post })
}

export const viewPost = (post) => {
  store.dispatch('post/viewPost', post)
}