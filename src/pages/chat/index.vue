<template>
  <div class="container">
    <div v-for="(room, index) in rooms" :key="index">
      <Chatroom :room="room" />
      <div v-if="index !== messageList.length -1" class="chatroom-divisor" />
    </div>
  </div>
</template>


<script>
import { retrieveMessageList } from "../../client/message";
import { blue } from "@ant-design/colors";
import Chatroom from "../../components/chatroom";
import apolloClient from "../../client";
import { mapGetters, mapActions } from 'vuex';

export default {
  components: { Chatroom },
  data() {
    return {
      messageList: []
    };
  },
  onLoad(query) {},
  computed: {
    ...mapGetters("chat", {
      rooms: 'rooms'
    })
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '聊天'
    });
    const messageList = await retrieveMessageList();
    // this.messageList = messageList;
    this.setRooms(messageList)
  },
  methods: {
    ...mapActions("chat", {
      setRooms: 'setRooms'
    })
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