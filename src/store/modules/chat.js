import { SET_ROOMS,
  ADD_MESSAGE,
  READ_MESSAGE,
  SET_CHATTER_ID,
  SET_MESSAGES
} from '../mutation-types'

// initial state
const initialState = {
  rooms: [],
  // format: [roomid]: [messages]
  messages: {},
  reads: {},
  currentChat: {} // { chatterId, roomId, messages }
}

// getters
const getters = {
  // process more
  rooms: (state, getters, rootState) => {
    return state.rooms
  },
  messages: (state, getters, rootState) => {
    return (roomId) => state.messages[roomId]
  },
  readsByRoomId: (state, getters, rootState) => {
    return (roomId) => state.reads[roomId] || false
  },
  currentChat: (state, getters, rootState) => {
    return state.currentChat
  },
  allMsg: (state, getters, rootState) => {
    return state.messages
  }
}

// actions
const actions = {
  setRooms ({ commit, state }, rooms) {
    console.log('Setting rooms', rooms)
    commit(SET_ROOMS, rooms)
  },
  addMessage ({ commit, state }, newMsessage) {
    commit(ADD_MESSAGE, newMsessage)
  },
  setMessages ({ commit, state }, { roomId, messages }) {
    commit(SET_MESSAGES, { roomId, messages })
  },
  setReadMessage ({ commit, state }, roomId) {
    commit(READ_MESSAGE, roomId)
  },
  setCurrentChat ({ commit, state }, { chatterId, roomId }) {
    commit(SET_CHATTER_ID, { chatterId, roomId })
  }
}

// mutations
const mutations = {
  async [SET_ROOMS] (state, rooms) {
    state.rooms = rooms || []
  },
  async [ADD_MESSAGE] (state, newMessage) {
    console.log('Adding new message', newMessage)
    const {
      room: {
        roomId
      },
      ...rest
    } = newMessage
    console.log('Adding new message2', roomId)
    if (!state.messages[roomId]) {
      state.messages[roomId] = []
    }
    // if (state.currentChat.roomId === roomId) {
    //   state.currentChat.messages.unshift(newMessage)
    // }
    state.messages[roomId].unshift(newMessage)
    console.log('state.newMessage', state.messages)
    const index = state.rooms.findIndex(room => room.roomId === roomId)
    console.log('state.rooms index', index)
    if (index !== -1) {
      console.log('Prioritizing rooms', state.rooms)
      state.rooms[index].message = rest
      const tempRoom = state.rooms[index]
      state.rooms.splice(index, 1)
      state.rooms.unshift(tempRoom)
    } else {
      const tempRoom = newMessage.room
      tempRoom.message = rest
      console.log('state.rooms before', state.rooms)
      state.rooms.unshift(tempRoom)
      console.log('state.rooms after', state.rooms)
    }
    state.reads[roomId] = false
    console.log('state.rooms', state.rooms, state.reads)
  },
  async [READ_MESSAGE] (state, roomId) {
    state.reads[roomId] = true
  },
  async [SET_CHATTER_ID] (state, { chatterId, roomId }) {
    const obj = { chatterId, roomId }
    if (roomId) {
      obj.messages = state.messages[roomId] || []
    } else {
      obj.messages = []
    }
    state.currentChat = obj
  },
  async [SET_MESSAGES] (state, { roomId, messages }) {
    state.messages[roomId] = messages
    if (state.currentChat.roomId === roomId) {
      state.currentChat.messages = messages
    }
  },
  reset (state) {
    console.log('chat reset')
    state.rooms = initialState.rooms
    state.messages = initialState.messages
    state.reads = initialState.reads
    state.currentChat = initialState.currentChat
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
