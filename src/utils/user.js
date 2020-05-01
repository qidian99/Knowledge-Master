import http from './request'
import { updateUserProfileMutation, subscribeToTopicMutation, currentUserQuery } from './queries'


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
