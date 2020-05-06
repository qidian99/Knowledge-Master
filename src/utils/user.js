import store from '../store'

export const setViewOtherUser = (user) => store.dispatch('user/setViewOtherUser', user)
export const setAuthToken = ({ token, user }) => {
  store.dispatch("auth/setAuthToken", { token, user });
}
export const setUser = (user) => store.dispatch("auth/setUser", user);
export const setPosts = (posts) => store.dispatch("posts/setPosts", posts);
export const setUserTopic = (topic) => store.dispatch("topics/setUserTopic", topic);

export const handleViewUser = async function(user) {
  console.log("other user clicked", user);
  setViewOtherUser(user);
  wx.navigateTo({
    url: "/pages/user/main"
  });
}