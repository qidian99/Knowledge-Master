<template>
  <div class="b-chatroom">
    <img class="chatroom-avatar" :src="to.avatarUrl || '/static/images/github-logo.svg'" />
    <div class="chatroom-username">
      {{to.username || to.nickName}}
      <!-- <div v-if="!read">Unread</div> -->
    </div>
    <div class="chatroom-message">
      <div class="message-content">
        {{currentRoom.message.content}}
      </div>
      <div class="message-ts">
        {{timestamp}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  props: {
    room: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // console.log('reading param', this.readsByRoomId()(this.room.roomId))
  },
  computed: {
    ...mapGetters("auth", {
      user: "user"
    }),
    ...mapGetters("chat", {
      // readsByRoomId: "readsByRoomId",
      rooms: "rooms"
    }),
    to: function () {
      if (this.chatterOne.userId !== this.user.userId) {
        return this.chatterOne;
      }
      return this.chatterTwo;
    },
    timestamp: function () {
      const ts = this.message.createdAt;
      if (moment() - ts < 86400000 / 6) {
        return moment(ts, "x").fromNow();
      }
      return moment(ts, "x").format("YYYY/MM/DD hh:mm");
    },
    // read: function () {
    //   return this.readsByRoomId()(this.room.roomId)
    // },
    currentRoom: function () {
      return this.rooms.find(room => room.roomId === this.room.roomId)
    },
    message: function () {
      return this.currentRoom.message
    }
  },
  data() {
    return {
      chatterOne: this.room.chatterOne,
      chatterTwo: this.room.chatterTwo,
    };
  },
  methods: {
  }
};
</script>

<style scoped>
.b-chatroom {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas: 
    "avatar username" 
    "avatar message";
  background-color: #fafafa;
}

.chatroom-avatar {
  grid-area: avatar;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 15px;
  align-self: center;
}

.chatroom-username {
  grid-area: username;
  padding-top: 12px;
  padding-right: 15px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  align-self: center;
}


.chatroom-message {
  display: flex;
  flex: 1;
  grid-area: message;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  align-self: center;
  flex-wrap: wrap;
  /* border: 2px solid black; */
  padding-bottom: 12px;
  padding-right: 15px;
  /* border: 2px solid black; */
  overflow: hidden;
}

.message-ts {
  color: rgba(0, 0, 0, 0.45);
  float: right;
}

.message-content {
  color: rgba(0, 0, 0, 0.65);
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-breaK:break-all;
  hyphens: auto;
}

</style>
