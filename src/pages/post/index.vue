<template>
  <div class="b-full-post">
    <PostCard :fullview="true" :post="post" :setLikesOfAPost="setLikesOfAPost" />
    <div class="post-card-divisor" />

    <div class="b-comment-panel">
      <img class="comment-icon" src="/static/icons/edit-square.svg" />
      <div class="b-comment-input">
        <input
          maxlength="150"
          :value="inputText"
          class="comment-input"
          placeholder="请输入评论"
          @input="handleCommentInput"
        />
      </div>
      <img
        class="comment-btn"
        @touchstart="btning = true"
        @touchend="btning = false"
        :class="{ active: btning }"
        @click="replyButtonClicked"
        src="/static/icons/send.svg"
      />
    </div>
    <div class="b-comments-scrollview">
      <ScrollView class="b-comments" v-for="(comment,index) in commentsArray" :key="index">
        <CommentCard
          :index="index"
          :id="comment.commentId"
          :comment="comment"
          @clickcomment="handleCommentClick"
        />
      </ScrollView>
    </div>
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";
import { createComment } from "../../utils/post";
import CommentCard from "@/components/comment-card";
import PostCard from "@/components/post-card";
import moment from "moment";
console.log("grey", presetPrimaryColors);
export default {
  components: { CommentCard, PostCard },
  data() {
    return {
      btning: false,
      inputText: "",
      commentsArray: [],
      mockPost: {
        postId: "5ea8cf58457e6da114a1de47",
        title: "我是加州罗志祥",
        body: "牛逼吧",
        createdAt: "1588121432556",
        updatedAt: "1588121432556",
        likes: 0,
        hide: false,
        user: {
          userId: "5ea847253a89ea55c16105ec",
          openid: "otVZc5QIASQCvzmje10-fn2EBC50",
          username: null
        },
        topic: { topicId: "5ea85a2fddcdf45949b74c0d", name: "生活" },
        block: "default"
      }
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "浏览帖子"
    });
    console.log("浏览帖子", this.post);
    this.commentsArray = this.comments;
  },
  computed: {
    ...mapGetters("post", {
      post: "post"
    }),
    title: function() {
      return this.post.title;
    },
    body: function() {
      return this.post.body;
    },
    time: function() {
      if (moment() - this.post.createdAt < 86400000 / 6) {
        return moment(this.post.createdAt, "x").fromNow();
      }
      return moment(this.post.createdAt, "x").format("YYYY/MM/DD hh:mm");
    },
    user: function() {
      const { user } = this.post;
      // console.log('slicing', user)
      if (user.username) {
        return user.username;
      } else {
        return `用户 ${user.openid.slice(0, 5)}****`;
      }
    },
    likes: function() {
      return this.post.likes;
    },
    comments: function() {
      console.log("COMMENT", this.post.comments);
      return this.post.comments;
    }
  },
  methods: {
    ...mapActions("posts", {
      setLikesOfAPost: "setLikesOfAPost"
    }),
    ...mapActions("posts", {
      setCommentsOfAPost: "setCommentsOfAPost"
    }),
    handleCommentInput: function(e) {
      const {
        mp: {
          detail: { value }
        }
      } = e;
      // console.log(e)
      if (value.length > 10) {
        // error
      }
      // console.log(value, this);
      this.inputText = value;
    },
    replyButtonClicked: async function() {
      console.log('comment clicked', this.inputText)
      const c = await createComment(this.post.postId, this.inputText)
      console.log(c)
      const temp = [...this.commentsArray]
      this.commentsArray = [c, ...temp]
      this.inputText = ''
      this.setCommentsOfAPost({ postId: this.post.postId, comments: this.commentsArray })

    }
  }
};
</script>

<style scoped>
.b-full-post {
  margin-top: 5%;
}
.post-card-divisor {
  grid-area: div;
  width: 100%;
  margin: 0px 0px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.b-comment-panel {
  z-index: 100;
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

.comment-icon {
  grid-area: icon;
  width: 24px;
  height: 24px;
  place-self: center center;
}
.comment-btn {
  border-radius: 8px;
  grid-area: submit;
  width: 24px;
  height: 24px;
  place-self: center center;
}

.comment-btn.active {
  background-color: rgba(0, 0, 0, 0.08);
}

.b-comment-input {
  grid-area: input;
  border-radius: 20px;
  background-color: white;
}
.comment-input {
  padding: 8px;
  font-size: 16px;
}

.b-comments {
}

.b-comments-scrollview {
  z-index: 10;
  height: auto;
  padding: 0px 162px 0px 0px;
  width: 100%;
  margin: 0px 0px 62px 0px;
}
</style>
