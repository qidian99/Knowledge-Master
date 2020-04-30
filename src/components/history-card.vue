<template>
  <div class="b-history-card" :style="containerStyle">
    <div
      class="history-card-title"
      @touchstart="hover = true"
      @touchend="hover = false"
      :class="{ active: hover && !fullview }"
      @click="handleClick"
    >
      [{{topic}}] {{title}}
    </div>
    <div class="history-card-divisor" />
    <div class="card-meta">
      <div class="card-user">{{user}}</div>  
      <div class="card-time">{{time}}</div>
    </div>
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
import { likeAPost } from "../utils/post";
import moment from "moment";
import { mapGetters, mapState, mapActions } from "vuex";

// console.log("grey", presetPrimaryColors);
export default {
  props: {
    post: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: -1
    },
    fullview: {
      type: Boolean,
      default: false
    },
    setLikesOfAPost: {
      type: Function,
      deafult: () => {}
    }
  },
  data() {
    return {
      hover: false,
      liking: false,
      likeArray: [],
      commenting: false
    };
  },
  onLoad: function() {
    console.log("History card loaded with props: ", this.post);
    this.likeArray = this.post.likes;
  },
  computed: {
    ...mapGetters("auth", {
      userObj: "user"
    }),
    containerStyle: function() {
      if (this.index && this.index !== 0) {
        return "margin-top: -5%;";
      }
      return "";
    },
    topic: function() {
      return this.post.topic.name;
    },
    title: function() {
      return this.post.title;
    },
    body: function() {
      return this.post.body;
    },
    time: function() {
      // 发布于
      // if (moment() - this.post.createdAt < 86400000 / 6) {
      //   return moment(this.post.createdAt, "x").fromNow();
      // }
      // return moment(this.post.createdAt, "x").format("YYYY/MM/DD hh:mm");

      // 浏览于
      if (moment() - moment(this.post.timestamp) < 86400000 / 6) {
        return '浏览于 ' + moment(this.post.timestamp).fromNow();
      }
      return '浏览于 ' + moment(this.post.timestamp).format("YYYY/MM/DD hh:mm");
    },
    user: function() {
      const { user } = this.post;
      console.log("checkinguser:", user);

      // check for local username
      if (this.userObj.userId == user.userId && this.userObj.username) {
        return "By " + this.userObj.username;
      }

      if (user.username) {
        return "By " + user.username;
      } else if (user.nickName) {
        return "By " + user.nickName;
      } else {
        return `用户 ${user.openid.slice(0, 5)}****`;
      }
    },
    likes: function() {
      return this.likeArray.length;
    },
    comments: function() {
      return this.post.comments.length;
    },
    doILiked: function() {
      const index = this.likeArray.findIndex(
        u => this.userObj.userId === u.userId
      );
      console.log(
        "computing do i like",
        this.likeArray,
        this.userObj.userId,
        index
      );
      return index !== -1;
    }
  },
  methods: {
    handleClick: function() {
      console.log("Post clicked", this.post);
      this.notifyClick();
    },
    notifyClick() {
      this.$emit("clickhistory", this.post);
    },
  }
};
</script>

<style scoped>
.b-history-card {
  display: grid;
  width: 100%;
  grid-template-columns: 40% 60%;
  grid-auto-columns:max-content;
  grid-template-rows: auto;
  grid-template-areas: "title title" "div div" "meta meta";
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 24;
}

.history-card-divisor {
  grid-area: div;
  /* width: 100%; */
  margin: 0px 0px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.history-card-title {
  grid-area: title;
  /* border: 10px solid red; */
  color: rgba(0, 0, 0, 0.85);
  padding: 10px 20px 10px 20px;
  font-family: Microsoft Yahei;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
}

.history-card-title.active {
  background-color: rgba(0, 0, 0, 0.15);
}

.history-card-other {
  color: rgba(0, 0, 0, 0.45);
  padding: 10px 20px 10px 0px;
  font-size: 14px;
  font-weight: normal;
}


.card-meta {
  grid-area: meta;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 20px 10px 20px;
}

.card-time {
  /* border: 1px solid red; */
  width: auto;
  color: rgba(0, 0, 0, 0.45);
  /* padding: 0px 20px 10px 20px; */
  text-align: left;
  font-size: 14px;
  font-weight: normal;
}

.card-user {
  flex-basis: 45%;
  flex-grow: 3;
  width: auto;
  /* border: 1px solid black; */
  text-align: left;
  color: rgba(0, 0, 0, 0.45);
  /* padding: 0px 20px 10px 20px; */
  font-size: 14px;
  font-weight: normal;
}
/* 
.card-time {
  text-align: right;
  width: auto;
  color: rgba(0, 0, 0, 0.45);
  justify-items: right;
  padding: 0px 20px 10px;
  font-size: 14px;
  font-weight: normal;
  grid-area: time;
}

.card-user {
  grid-area: user;
  text-align: left;
  color: rgba(0, 0, 0, 0.45);
  padding: 0px 20px 10px;
  font-size: 14px;
  font-weight: normal;
} */
</style>
