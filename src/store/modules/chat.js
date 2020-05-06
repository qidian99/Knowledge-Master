import { SET_ROOMS, ADD_MESSAGE, READ_MESSAGE } from '../mutation-types'

// initial state
const initialState = {
  rooms: [],
  // format: [roomid]: [messages]
  messages: {},
  reads: {}
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
  setReadMessage ({ commit, state }, roomId) {
    commit(READ_MESSAGE, roomId)
  },
}

// mutations
const mutations = {
  async [SET_ROOMS] (state, rooms) {
    state.rooms = rooms
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
    state.messages[roomId].unshift(newMessage)
    console.log('state.newMessage', state.messages)
    const index = state.rooms.findIndex(room => room.roomId === roomId);
    console.log('state.rooms index', index)
    const tempRoom = newMessage.room;
    tempRoom.message = rest;
    if (index !== -1) {
      console.log('Prioritizing rooms', state.rooms)
      state.rooms.splice(index, 1)
      state.rooms.unshift(tempRoom)
    } else {
      console.log('state.rooms before', state.rooms)
      state.rooms.unshift(tempRoom)
      console.log('state.rooms after', state.rooms)
    }
    state.reads[roomId] = false;
    console.log('state.rooms', state.rooms, state.reads)
  },
  async [READ_MESSAGE] (state, roomId) {
    state.reads[roomId] = true;
  },
  reset (state) {
    console.log('chat reset')
    state.rooms = initialState.rooms
    state.messages = initialState.messages
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
