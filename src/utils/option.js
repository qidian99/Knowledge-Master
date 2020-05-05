import store from '../store'
import { deletePost } from '../client/post'

const removePost = (post) => {
  store.dispatch('removePost', post)
}

const setOptionPost = (post) => {
  store.dispatch('option/setOptionPost', post)
}

const editPost = (post) => {
  store.dispatch('edit/editPost', post)
}

const modalConfirm = async function (post) {
  try {
    const res = await deletePost(post.postId);
    console.log("Delete res", res);
    removePost(post);
    setOptionPost(null);
  } catch (err) {
    console.log("Delete post failed", err);
  }
}
const modalCancel = function () {}

export const handleDelete = async function (post, cb) {
  wx.showModal({
    title: "删除帖子",
    content: "目前不支持Archive，删除不可逆",
    success(res) {
      if (res.confirm) {
        console.log("用户点击确定");
        modalConfirm(post);
        if (cb) cb();
        console.log('Check if navigate back', cb)
      } else if (res.cancel) {
        console.log("用户点击取消");
        modalCancel();
      }
    }
  });
}

export const handleEdit = function (post) {
  editPost(post);
  setOptionPost(null);
  wx.navigateTo({
    url: "/pages/editPost/main"
  });
}

export const handleShowOptionSheet = function(optionPost) {
  setOptionPost(optionPost);
}

export const closeOptionSheet = function() {
  setOptionPost(null);
}