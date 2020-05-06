import {
  messageListQuery,
  messagesQuery,
  newMessageSubscription,
  sendMessageMutation
} from './graphql'
import store from '../store'
import apolloClient from './index'

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

export async function sendMessage (receiverId, content) {
  const operation = {
    query: sendMessageMutation,
    variables: {
      receiverId,
      content
    }
  }
  const res = await apolloClient.query(operation);
  const {
    data: {
      newMessage
    }
  } = res
  console.log('New Message', newMessage)
  return newMessage
}

export function subscribeToNewMessage () {
  console.log("[subscribeToNewMessage]")
  const operation = {
    query: newMessageSubscription
  }
  apolloClient.subscribe(operation, ({ data }) => {
    console.log("New message!",  data);
    store.dispatch('chat/addMessage', data.newMessage)
  });
}

export async function retrieveMessageList () {
  const operation = {
    query: messageListQuery,
  }
  const res = await apolloClient.query(operation);
  const {
    data: {
      messageList
    }
  } = res
  console.log('messageList', messageList)
  return messageList
}

export async function retrieveMessages (chatterId) {
  const operation = {
    query: messagesQuery,
    variables: {
      chatterId
    }
  }
  const res = await apolloClient.query(operation);
  const {
    data: {
      messages
    }
  } = res
  console.log('messages', messages)
  return messages
}
