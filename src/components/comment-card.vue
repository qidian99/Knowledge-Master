<template>
  <div class="b-comment-card">
    <div
      class="comment-card-body"
      @touchstart="hover = true"
      @touchend="hover = false"
      :class="{ active: hover }"
      @click="handleClick"
    >{{body}}</div>
    <div class="card-time">{{time}}</div>
    <div class="card-user">{{user}}</div>
    <!-- <div class="comment-card-other">{{likes}}</div> -->
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
import moment from "moment";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

export default {
  props: {
    comment: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: -1
    },
  },
  onLoad: function() {
    console.log("Comment card loaded with props: ", this.comment);
  },
  computed: {
    body: function() {
      return this.comment.body;
    },
    time: function() {
      if (moment() - this.comment.createdAt < 86400000 / 6) {
        return moment(this.comment.createdAt, "x").fromNow();
      }
      return moment(this.comment.createdAt, "x").format("YYYY/MM/DD hh:mm");
    },
    user: function() {
      const { user } = this.comment;
      if (user.username) {
        return 'By ' +　user.username;
      } else if (user.nickName) {
        return 'By ' +　user.nickName;
      } else {
        return `用户 ${user.openid.slice(0, 5)}****`;
      }
    },
  },
  data() {
    return {
      hover: false,
    };
  },
  methods: {
    // ...mapActions("posts", {
    //   setLikesOfAPost: "setLikesOfAPost"
    // }),
    handleClick: function() {
      console.log("Comment clicked", this.comment);
      this.notifyClick();
    },
    notifyClick() {
      this.$emit("clickcomment", this.comment);
    },
  }
};
</script>

<style scoped>
.b-comment-card {
  /* border: 10px solid red; */
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
  /* grid-template-areas: "title title" "div div" "body body" "time user" "meta meta"; */
  grid-template-areas: "body body" "time user";
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 24;
}

.b-comment-card.is--meta {
  grid-area: meta;
  display: grid;
  justify-content: stretch;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
  grid-template-areas: "like comment";
  background-color: transparent;
  font-size: 24;
}

/* .b-comment-card.active { */
.comment-card-body.active {
  background-color: rgba(0, 0, 0, 0.25);
}

.comment-card-divisor {
  grid-area: div;
  width: 100%;
  margin: 0px 0px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.comment-card-title {
  grid-area: title;
  color: rgba(0, 0, 0, 0.85);
  padding: 10px 20px 10px;
  font-family: Microsoft Yahei;
  font-size: 22px;
  font-weight: 500;
  text-align: left;
}

.comment-card-body {
  grid-area: body;
  color: rgba(0, 0, 0, 0.65);
  padding: 10px 20px 10px;
  font-size: 16px;
  font-weight: normal;
  text-align: left;
}

.comment-card-other {
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

.card-comment {
  display: flex;
  flex-direction: row;
  grid-area: comment;
  margin-right: 20px;
  place-self: stretch end;
  font-size: 14px;
  font-weight: normal;
  color: #1296db;
  /* border: 10px solid black; */
}

.card-comment.active {
  background-color: rgba(0, 0, 0, 0.25);
}

.card-bottom-text {
  padding: 0px 5px 0px 5px;
}

.like-button {
  width: 45rpx;
  height: 45rpx;
}

.card-like {
  display: flex;
  flex-direction: row;
  margin: 0px 20px 10px;
  grid-area: like;
  place-self: stretch start;
  font-size: 14px;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.45);
  /* background-color: rgba(0, 0, 0, 0.25); */
  /* border: 10px solid black; */
}

.card-like.active {
  background-color: rgba(0, 0, 0, 0.25);
}
</style>
