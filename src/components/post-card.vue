<template>
  <div class="b-post-card" :style="containerStyle">
    <div class="b-post-card-title" :class="{ active: hoverTitle && !fullview }">
      <div
        class="post-card-title"
        @touchstart="hoverTitle = true"
        @touchend="hoverTitle = false"
        @click="handleClick"
      >{{title}}</div>
      <div
        v-if="!showDelete && isMyPost"
        class="post-card-options"
        @touchstart="hoverOption = true"
        @touchend="hoverOption = false"
        @click="handleOption"
        :class="{ active: hoverOption }"
      >
        <img class="option-button" src="/static/icons/more.svg" />
      </div>
    </div>
    <div class="post-card-divisor" />
    <div
      class="b-post-card-body"
      @touchstart="hover = true"
      @touchend="hover = false"
      transition="expand"
      :class="{ active: hover && !fullview }"
    >
      {{shownBody}}
      <span v-if="body.length > 50">
        <span
          class="post-card-body-expand"
          v-if="!expanded"
          transition="expand"
          @click="handleBodyClick"
        >...展开</span>
        <span
          class="post-card-body-expand"
          v-if="expanded"
          transition="bounce"
          @click="handleBodyClick"
        >...收起</span>
      </span>
    </div>
    <div class="card-time">{{time}}</div>
    <div
      v-if="!isMyPost || !showDelete"
      @click="handleViewUser"
      @touchstart="clickuser = true"
      @touchend="clickuser = false"
      :class="{ active: clickuser }"
      class="card-user"
    >{{user}}</div>
    <div class="b-post-card is--meta">
      <div
        class="card-like"
        @touchstart="liking = true"
        @touchend="liking = false"
        :class="{ active: liking }"
        @click="onLikeClick"
      >
        <img v-if="!doILiked" class="like-button" src="/static/icons/like.svg" />
        <img v-else class="like-button" src="/static/icons/like-fill.svg" />

        <div class="card-bottom-text">{{likes}}</div>
      </div>
      <div
        class="card-comment"
        @touchstart="commenting = true"
        @touchend="commenting = false"
        @click="handleClick"
        :class="{ active: commenting }"
      >
        <div class="card-bottom-text">{{comments}}</div>
        <img style="width:45rpx; height:45rpx;" src="/static/icons/comment.svg" />
      </div>
    </div>
    <div
      class="post-delete"
      @touchstart="deleting = true"
      @touchend="deleting = false"
      @click="handleDelete"
      :class="{ active: deleting }"
      v-if="isMyPost && showDelete"
    >删除</div>
    <div class="b-post-images" v-if="post.images && post.images.length">
      <DisplayImages 
        ref="imgs"
        :showTip="false"
        :showDelete="false"
        :showAdd="false"
        :files="(post.images || []).map(url => 'https://' + url)"
        :thumbnailStyle="thumbnailStyle"
      />
    </div>
    <!-- <div class="post-card-other">{{likes}}</div> -->
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
import { likeAPost } from "../utils/post";
import DisplayImages from "../components/display-images";
import PostImages from "../components/post-images";
import moment from "moment";
import { mapGetters, mapState, mapActions } from "vuex";

// console.log("grey", presetPrimaryColors);
export default {
  components: {
    DisplayImages,
    PostImages
  },
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
    },
    showDelete: {
      type: Boolean,
      default: false
    },
    thumbnailStyle: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      hover: false, // hover body
      hoverTitle: false,
      liking: false,
      likeArray: [],
      commenting: false,
      deleting: false,
      clickuser: false,
      expanded: false,
      hoverOption: false,
    };
  },
  onLoad: function() {
    console.log("Post card loaded with props: ", this.post);
    this.likeArray = this.post.likes;
  },
  updated: function() {
    // const self = this
    // self.$nextTick(function () {
    //   if (self.images.length !== 0 && self.$refs.imgs.setFiles) {
    //     self.$refs.imgs.setFiles(self.images);
    //   }
    // })
  },
  mounted: function() {
    // if (this.images.length !== 0 && this.$refs.imgs.setFiles) {
    //   this.$refs.imgs.setFiles(this.images);
    // }
  },
  // onUpdated
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
    title: function() {
      return this.post.title;
    },
    body: function() {
      return this.post.body;
    },
    shownBody: function() {
      if (this.body.length > 50 && !this.expanded) {
        return this.body.slice(0, 50);
      } else {
        return this.body;
      }
    },
    time: function() {
      if (this.fullview) {
        if (moment() - this.post.createdAt < 86400000 / 6) {
          return moment(this.post.createdAt, "x").fromNow();
        }
        return moment(this.post.createdAt, "x").format("YYYY/MM/DD hh:mm");
      }
      if (moment() - this.post.updatedAt < 86400000 / 6) {
        return moment(this.post.updatedAt, "x").fromNow();
      }
      return moment(this.post.updatedAt, "x").format("YYYY/MM/DD hh:mm");
    },
    user: function() {
      const { user } = this.post;
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
      return index !== -1;
    },
    isMyPost: function() {
      return this.post.user.userId === this.userObj.userId;
    }
  },
  methods: {
    handleClick: function() {
      this.notifyClick();
    },
    notifyClick() {
      this.$emit("clickpost", this.post);
    },
    async onLikeClick() {
      const likes = await likeAPost(this.post.postId);
      this.likeArray = likes;
      this.setLikesOfAPost({ postId: this.post.postId, likes });
    },
    handleDelete() {
      this.$emit("clickdelete", this.post);
    },
    handleOption() {
      console.log("Option clicked", this.post);
      this.$emit("clickoption", this.post);
    },
    handleViewUser() {
      this.$emit("clickuser", this.post.user);
    },
    handleBodyClick() {
      console.log("The body is expanding");
      this.expanded = !this.expanded;
    }
  }
};
</script>

<style scoped>
.b-post-card {
  /* border: 10px solid red; */
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
  grid-template-areas:
    "title title"
    "div div"
    "body body"
    "img img"
    "time user"
    "meta meta";
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 24;
}

.b-post-card.is--meta {
  grid-area: meta;
  display: grid;
  justify-content: stretch;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
  grid-template-areas: "like comment";
  background-color: transparent;
  font-size: 24;
  padding-bottom: 10px;
}

.post-card-divisor {
  grid-area: div;
  width: 100%;
  margin: 0px 0px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.b-post-card-title {
  grid-area: title;
  color: rgba(0, 0, 0, 0.85);
  padding: 10px 20px 10px;
  font-family: Microsoft Yahei;
  font-size: 22px;
  font-weight: 500;
  text-align: left;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.post-card-options {
  /* float: right; */
  /* flex: 1; */
  text-align: right;
  /* justify-self: flex-end; */
  /* border: 10px solid black; */
}

.post-card-title {
  flex: 1;
}

.post-delete {
  grid-area: user;
  place-self: center end;
  text-align: right;
  color: rgba(255, 0, 0, 1);
  margin-right: 20px;
  font-size: 14px;
  font-weight: normal;
  /* border: 10px solid black; */
}

.post-delete.active {
  background-color: rgba(0, 0, 0, 0.15);
}

.b-post-card-body {
  grid-area: body;
  color: rgba(0, 0, 0, 0.65);
  padding: 10px 20px 10px;
  font-size: 16px;
  font-weight: normal;
  text-align: left;
  word-wrap: break-word;
  /* border: 10px solid black; */
}

.post-card-body-expand {
  text-align: right;
  color: #1296db;
  font-size: 14px;
  margin-top: 2px;
  /* float: left; */
}
.post-card-body {
  /* grid-area: body;
  color: rgba(0, 0, 0, 0.65);
  padding: 10px 20px 10px;
  font-size: 16px;
  font-weight: normal;
  text-align: left; */
  /* float: left; */
}

.post-card-options.active {
  opacity: 0.7;
}

.b-post-card-title.active {
  background-color: rgba(0, 0, 0, 0.15);
}
.post-card-body.active {
  background-color: rgba(0, 0, 0, 0.15);
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
  color: #1296db;
}
.card-user.active {
  opacity: 0.7;
}

.card-comment {
  display: flex;
  flex-direction: row;
  grid-area: comment;
  margin-right: 20px;
  place-self: start end;
  font-size: 14px;
  font-weight: normal;
  color: #1296db;
}

.card-comment.active {
  background-color: rgba(0, 0, 0, 0.15);
}

.card-bottom-text {
  padding: 0px 5px 0px 5px;
}

.like-button {
  width: 45rpx;
  height: 45rpx;
}

.option-button {
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
  /* background-color: rgba(0, 0, 0, 0.15); */
  /* border: 10px solid black; */
}

.card-like.active {
  background-color: rgba(0, 0, 0, 0.15);
}
</style>

<style scoped>
/* always present */
.expand-transition {
  transition: all 0.3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
.expand-enter,
.expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}

.b-post-images {
  grid-area: img;
}
</style>