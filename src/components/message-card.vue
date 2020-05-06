<template>
  <div class="b-message">
    <img class="message-avatar" :src="avatarUrl" />
    <div class="message-username">
      {{name}}
    </div>
    <div class="message-message">
      <div class="message-content">
        {{message.content}}
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
    message: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // console.log('message mounted', this.message)
  },
  computed: {
    ...mapGetters("auth", {
      user: "user"
    }),
    ...mapGetters("chat", {
      rooms: "rooms"
    }),
    amISender: function () {
      const {
        sender,
        receiver,
      } = this.message
      if (sender.userId === this.user.userId) { // I sent the message
        return true;
      }
      return false;
    },
    avatarUrl:  function () {
      return this.message.sender.avatarUrl || '/static/images/github-logo.svg'
    },
    timestamp: function () {
      const ts = this.message.createdAt;
      if (moment() - ts < 86400000 / 6) {
        return moment(ts, "x").fromNow();
      }
      return moment(ts, "x").format("YYYY/MM/DD hh:mm");
    },
    name: function () {
      const user = this.message.sender
      return user.username || user.nickName
    }
  },
  // data() {
  //   return {
  //   };
  // },
  methods: {
  }
};
</script>

<style scoped>
.b-message {
  height: 100px;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas: 
    "avatar username" 
    "avatar message";
  background-color: #fafafa;
}

.message-avatar {
  grid-area: avatar;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 15px;
  align-self: center;
}

.message-username {
  grid-area: username;
  padding-top: 12px;
  padding-right: 15px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  align-self: center;
}


.message-message {
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
