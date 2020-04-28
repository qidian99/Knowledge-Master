<template>
  <div
    @touchstart="hover = true"
    @touchend="hover = false"
    class="b-post-card"
    :class="{ active: hover }"
    @click="handleClick"
    :style="containerStyle"
  >
    <div class="post-card-title">{{title}}</div>
    <div class="post-card-divisor" />
    <div class="post-card-body">{{body}}</div>
    <div class="b-post-card-info">
      <div class="card-time">{{time}}</div>
      <div class="card-user">{{user}}</div>
    </div>
    <!-- <div class="post-card-other">{{likes}}</div> -->
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
import moment from "moment";
console.log("grey", presetPrimaryColors);
export default {
  props: {
    post: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: -1
    }
  },
  computed: {
    containerStyle: function() {
      if (this.index !== 0) {
        return "margin-top: -5%;"
      }
    },
    title: function() {
      return this.post.title;
    },
    body: function() {
      return this.post.body;
    },
    time: function() {
      return moment(this.post.createdAt, "x").format("YYYY/MM/DD hh:mm");
    },
    user: function() {
      const { user } = this.post;
      if (user.username) {
        return user.name;
      } else {
        return `用户 ${user.openid.slice(0, 5)}****`;
      }
    },
    likes: function() {
      return this.post.likes;
    }
  },
  data() {
    return {
      hover: false
    };
  },
  methods: {
    handleClick: function() {
      console.log("Posts clicked");
    }
    // notifiyTopic () {
    //   this.$emit('clicktopic', {
    //     topic: this.topic
    //   })
    // }
  }
};
</script>

<style scoped>
.b-post-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  /* border: 1px solid rgba(0, 0, 0, 15); */
  font-size: 24;
  text-align: center;
  /* border-radius: 5px; */
  /* margin: 10px; */
}

.b-post-card.active {
  background-color: rgba(0, 0, 0, 0.25);
}

.b-post-card-info {
  /* border: 10px solid red; */
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: "time user";
}

.post-card-divisor {
  width: 100%;
  margin: 0px 0px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.post-card-title {
  color: rgba(0, 0, 0, 0.85);
  padding: 10px 20px 10px;
  font-family: Microsoft Yahei;
  font-size: 22px;
  font-weight: 500;
  text-align: left;
}

.post-card-body {
  color: rgba(0, 0, 0, 0.65);
  padding: 10px 20px 10px;
  font-size: 16px;
  font-weight: normal;
  text-align: left;
}

.post-card-other {
  color: rgba(0, 0, 0, 0.45);
  padding: 10px 20px 10px;
  font-size: 14px;
  font-weight: normal;
}

.card-time {
  text-align: left;
  color: rgba(0, 0, 0, 0.45);
  padding: 0px 20px 10px;
  font-size: 14px;
  font-weight: normal;
  grid-area: time;
}

.card-user {
  grid-area: user;
  text-align: right;
  width: auto;
  color: rgba(0, 0, 0, 0.45);
  justify-items: right;
  margin-right: 20px;
  font-size: 14px;
  font-weight: normal;
  /* border: 10px solid black; */
}
</style>
