<template>
  <div class="container" ref="container">
    <div class="b-message-panel">
      <img class="message-icon" src="/static/icons/edit-square.svg" />
      <div class="b-message-input">
        <input
          cursor-spacing="140"
          maxlength="150"
          :value="inputText"
          class="message-input"
          placeholder="发送消息"
          @input="handleMessageInput"
        />
      </div>
      <img
        class="message-btn"
        @touchstart="btning = true"
        @touchend="btning = false"
        :class="{ active: btning }"
        @click="msgButtonClicked"
        src="/static/icons/send.svg"
      />
    </div>
    <div class="b-message-card">
      <div v-for="(message, index) in messages" :key="index">
        <MessageCard :message="message" />
      </div>
      <!-- <div v-if="tempMessage">
        <MessageCard :message="tempMessage" />
      </div> -->
    </div>
  </div>
</template>


<script>
import { blue } from "@ant-design/colors";
import MessageCard from "../../components/message-card";
import apolloClient from "../../client";
import { retrieveMessages, sendMessage } from "../../client/message";
import { getUser } from "../../client/user";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { MessageCard },
  data() {
    return {
      inputText: "",
      replying: false,
      chatter: null,
      tempMessage: null
    };
  },
  onLoad(query) {},
  computed: {
    ...mapGetters("chat", {
      rooms: "rooms",
      allMsg: "allMsg",
      currentChat: "currentChat",
      messagesFn: "messages"
    }),
    ...mapGetters("auth", {
      user: "user"
    }),
    messages: function() {
      if (this.currentChat.roomId) {
        // console.log("messages", this.messagesFn(this.currentChat.roomId));
        console.log("this.currentChat.roomId", this.currentChat.roomId);
        return this.allMsg[this.currentChat.roomId];
      }
      return [];
    },
    title: function() {
      if (this.chatter) {
        return this.chatter.username || this.chatter.nickName;
      }
      return "Loading...";
    }
  },
  async mounted() {
    this.scrollToEnd();
    const { chatterId, roomId } = this.currentChat;
    const chatter = await getUser(chatterId);
    console.log("chatter", chatter);
    this.chatter = chatter;
    wx.setNavigationBarTitle({
      title: this.title
    });
    if (roomId) {
      const messages = await retrieveMessages(chatterId);
      console.log("Retrieved messasges: ", messages);
      this.setMessages({ roomId, messages });
    }
  },
  updated() {},
  methods: {
    ...mapActions("chat", {
      setRooms: "setRooms",
      setMessages: "setMessages",
      setCurrentChat: "setCurrentChat"
    }),
    handleMessageInput: function(e) {
      const {
        mp: {
          detail: { value }
        }
      } = e;
      // console.log(value);
      this.inputText = value;
    },
    msgButtonClicked: async function() {
      try {
        if (!this.replying && this.inputText !== "") {
          this.replying = true;
          const newMessage = await sendMessage(this.chatter.userId, this.inputText);
          this.inputText = "";
          this.replying = false;
          console.log('Test room id', newMessage);
          if (!this.currentChat.roomId) {
            this.setCurrentChat({
              roomId: newMessage.room.roomId,
              chatterId: this.currentChat.chatterId
            })
          }

        }
      } catch (e) {
        this.replying = false;
      }
      this.scrollToEnd();
    },
    scrollToEnd() {
      const query = wx.createSelectorQuery();
      query.select(".container").boundingClientRect();
      query.exec(ele => {
        console.log("scrolling to bottom", ele);
        let e = ele[0];
        wx.pageScrollTo({
          scrollTop: e.height
        });
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: transparent;
}

.b-message-panel {
  z-index: 10;
  position: fixed;
  bottom: 0px;
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: 50px auto 50px;
  grid-template-rows: 40px;
  grid-template-areas: "icon input submit";
  padding: 15px 0px 15px 0px;
  background-color: #e6f7ff;
}

.message-icon {
  grid-area: icon;
  width: 24px;
  height: 24px;
  place-self: center center;
}
.message-btn {
  border-radius: 8px;
  grid-area: submit;
  width: 24px;
  height: 24px;
  place-self: center center;
}

.message-btn.active {
  background-color: rgba(0, 0, 0, 0.08);
}

.b-message-input {
  grid-area: input;
  border-radius: 20px;
  background-color: white;
}
.message-input {
  padding: 8px;
  font-size: 16px;
}

.b-message-card {
  display: flex;
  flex-direction: column-reverse;
  padding-bottom: 200px;
}
</style>