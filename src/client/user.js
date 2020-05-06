import { updateUserProfileMutation, subscribeToTopicMutation, currentUserQuery, registerQuery, postsQueryWithTopic, userQuery } from './graphql'
import store from '../store'
import { subscribeToNewMessage } from './message'
import { fetchPosts } from './post'
import apolloClient from './index'
import {
  setViewOtherUser,
  setAuthToken,
  setUser,
  setPosts,
  setUserTopic,
  handleViewUser
} from '../utils/user'

export async function updateUserProfile (user) {
  const operation = {
    query: updateUserProfileMutation,
    variables: user
  }
  const res = await apolloClient.query(operation);
  const {
    data: {
      updateUserProfile
    }
  } = res
  console.log('Updated profile', updateUserProfile)
  return updateUserProfile
}

export async function subscribeToTopic (topicId) {
  const operation = {
    query: subscribeToTopicMutation,
    variables: {
      topicId
    }
  }
  const res = await apolloClient.query(operation);
  const {
    data: {
      subscribeToTopic
    }
  } = res
  console.log('Updated topic', subscribeToTopic)
  return subscribeToTopic
}


export async function currentUser () {
  const operation = {
    query: currentUserQuery
  }
  const res = await apolloClient.query(operation);
  const {
    data: {
      currentUser
    }
  } = res
  console.log('Current User in Apollo Client', currentUser)
  return currentUser
}

export const registerOpenid = async function (code) {
  try {
    const operation = {
      query: registerQuery,
      variables: {
        code
      }
    };
    const res = await apolloClient.query(operation);
    const {
      data: {
        registerOpenid: { user, token }
      }
    } = res;
    console.log("[Apollo]Registered, token is:", token, user);
    // set auth token
    setAuthToken({ token, user });

    // fetch posts
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

    // init subscription client in apollo
    apolloClient.initSubscriptionClient();

    // subscribe to new messages
    subscribeToNewMessage();
  } catch (err) {
    console.log(err)
  }
}

export const getUser = async function (userId) {
  const operation = {
    query: userQuery,
    variables: {
      userId
    }
  }
  const res = await apolloClient.query(operation);
  const {
    data: {
      user
    }
  } = res
  console.log('Get user', user)
  return user
}