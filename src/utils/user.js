import http from './request'
import { updateUserProfileMutation, subscribeToTopicMutation, currentUserQuery, registerQuery, postsQueryWithTopic } from './queries'
import store from '../store'
import { fetchPosts } from './post'


export async function updateUserProfile (user) {
  const payload = {
    query: updateUserProfileMutation,
    variables: user
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      updateUserProfile
    }
  } = r

  console.log('Updated profile', updateUserProfile)
  return updateUserProfile
}

export async function subscribeToTopic (topicId) {
  const payload = {
    query: subscribeToTopicMutation,
    variables: {
      topicId
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      subscribeToTopic
    }
  } = r

  console.log('Updated topic', subscribeToTopic)
  return subscribeToTopic
}


export async function currentUser () {
  const payload = {
    query: currentUserQuery
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      currentUser
    }
  } = r

  console.log('Current User', currentUser)
  return currentUser
}

const setViewOtherUser = (user) => store.dispatch('user/setViewOtherUser', user)
export const handleViewUser = async function(user) {
  console.log("other user clicked", user);
  setViewOtherUser(user);
  wx.navigateTo({
    url: "/pages/user/main"
  });
}


const setAuthToken = ({ token, user }) => store.dispatch("auth/setAuthToken", { token, user });
const setUser = (user) => store.dispatch("auth/setUser", user);
const setPosts = (posts) => store.dispatch("posts/setPosts", posts);
const setUserTopic = (topic) => store.dispatch("topics/setUserTopic", topic);

export const registerOpenid = async function (code) {
  const payload = {
    query: registerQuery,
    variables: {
      code
    }
  };
  const r = await http.post({
    payload
  });

  const {
    data: {
      registerOpenid: { user, token }
    }
  } = r;

  console.log("Registered, token is:", token, user);

  // set auth token
  setAuthToken({ token, user });

  if (user.subscription) {
    // set subscription
    setUserTopic(user.subscription);
    wx.setNavigationBarTitle({
      title: user.subscription.name
    });
    console.log("Fetching all post under topic:", user.subscription);
    const posts = await fetchPosts(postsQueryWithTopic, user.subscription.topicId);
    setPosts(posts);
  }
}