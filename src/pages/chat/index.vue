<template>
  <div class="container">
    <div v-for="(room, index) in rooms" :key="index" @click="handleClickRoom" :id="room.roomId">
      <Chatroom :room="room" />
      <div v-if="index !== rooms.length - 1" class="chatroom-divisor" />
    </div>
  </div>
</template>


<script>
import { retrieveMessageList } from "../../client/message";
import { blue } from "@ant-design/colors";
import Chatroom from "../../components/chatroom";
import apolloClient from "../../client";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { Chatroom },
  // data() {
  // },
  onLoad(query) {},
  computed: {
    ...mapGetters("chat", {
      rooms: "rooms",
    }),
    ...mapGetters("auth", {
      user: "user"
    })
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: "聊天"
    });
    const messageList = await retrieveMessageList();
    // this.messageList = messageList;
    this.setRooms(messageList);
  },
  methods: {
    ...mapActions("chat", {
      setRooms: "setRooms",
      setCurrentChat: "setCurrentChat"
    }),
    handleClickRoom: function(e) {
      const roomId = e.currentTarget.id;
      const room = this.rooms.find(room => room.roomId === roomId);
      const { chatterOne, chatterTwo } = room;
      const chatterId =
        chatterOne.userId !== this.user.userId
          ? chatterOne.userId
          : chatterTwo.userId;
      console.log("Extracted userId of the chatter", chatterId);
      this.setCurrentChat({ chatterId, roomId });
      wx.navigateTo({
        url: "/pages/message/main"
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: transparent;
}

.chatroom-divisor {
  grid-area: div;
  width: 100%;
  margin: 0px 0px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}
</style>