<template>
  <div class="b-full-post" v-if="forceRefresh">
    <PostCard
      :fullview="true"
      :post="post"
      :setLikesOfAPost="setLikesOfAPost"
      @clickdelete="handleDelete"
      @clickuser="handleViewUser"
      @clickoption="handleShowOptionSheet"
    />
    <div class="post-card-divisor" />

    <div class="b-comment-panel">
      <img class="comment-icon" src="/static/icons/edit-square.svg" />
      <div class="b-comment-input">
        <input
          cursor-spacing="140"
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
          @clickdelete="handleCommentDelete"
        />
      </ScrollView>
    </div>
    <!-- <modal
      title="删除评论"
      confirm-text="确定"
      cancel-text="取消"
      :hidden="commentModalHidden"
      @confirm="commentModalConfirm"
      @cancel="commentModalCancel"
    >你可别后悔</modal>
    <modal
      title="删除帖子"
      confirm-text="确定"
      cancel-text="取消"
      :hidden="modalHidden"
      @confirm="modalConfirm"
      @cancel="modalCancel"
    >你可别后悔</modal>-->
    <div class="b-option-sheet" v-if="optionPost" @click="closeOptionSheet" transition="expand">
      <OptionSheet :optionPost="optionPost" @optiondelete="handleDelete" @optionedit="handleEdit" />
    </div>
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";
import {
  createComment,
  deleteComment,
  fetchPosts,
  fetchPost,
  deletePost,
  clickPostAndNavigate
} from "../../utils/post";
import { currentUser, handleViewUser, registerOpenid } from "../../utils/user";
import {
  handleDelete,
  handleShowOptionSheet,
  closeOptionSheet,
  handleEdit
} from "../../utils/option";
import CommentCard from "@/components/comment-card";
import PostCard from "@/components/post-card";
import OptionSheet from "@/components/option-sheet";
import moment from "moment";
console.log("grey", presetPrimaryColors);
export default {
  components: { CommentCard, PostCard, OptionSheet },
  data() {
    return {
      btning: false,
      replying: false,
      inputText: "",
      commentsArray: [],
      commentToDelete: null,
      forceRefresh: true,
      // util import
      handleDelete: (post) => handleDelete(post, () => { wx.navigateBack() }),
      handleShowOptionSheet,
      closeOptionSheet,
      clickPostAndNavigate,
      handleEdit,
      handleViewUser,
      registerOpenid
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "浏览帖子"
    });
    console.log("浏览帖子", this.post);
    this.commentsArray = this.comments;
  },
  onShow() {
    const temp = this.posts.find(p => p.postId === this.post.postId);
    this.setImages(temp.images);
  },
  computed: {
    ...mapGetters("post", {
      post: "post"
    }),
    ...mapGetters("posts", {
      posts: "posts"
    }),
    ...mapGetters("option", {
      optionPost: "post"
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
      setLikesOfAPost: "setLikesOfAPost",
      setCommentsOfAPost: "setCommentsOfAPost",
      setPosts: "setPosts"
    }),
    ...mapActions("edit", {
      editPost: "editPost"
    }),
    ...mapActions("user", {
      setViewOtherUser: "setViewOtherUser"
    }),
    ...mapActions({
      removePost: "removePost"
    }),
    ...mapActions("post", {
      addComment: "addComment",
      setImages: "setImages"
    }),
    ...mapActions({
      removeComment: "removeComment"
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
      try {
        if (!this.replying && this.inputText !== "") {
          this.replying = true;
          console.log("comment clicked", this.inputText);
          const c = await createComment(this.post.postId, this.inputText);
          console.log(c);
          const temp = [...this.commentsArray];
          this.commentsArray = [c, ...temp];
          this.inputText = "";
          this.setCommentsOfAPost({
            postId: this.post.postId,
            comments: this.commentsArray
          });
          this.addComment(c);
          this.replying = false;
        }
      } catch (e) {
        this.replying = false;
      }
    },
    commentModalConfirm: async function() {
      try {
        const res = await deleteComment(this.commentToDelete.commentId);
        console.log("Delete res", res);
        this.removeComment({
          post: this.post,
          comment: this.commentToDelete
        });
        const temp = [...this.commentsArray];
        const index = temp.findIndex(
          c => c.commentId === this.commentToDelete.commentId
        );
        temp.splice(index, 1);
        this.commentsArray = temp;
        this.commentToDelete = null;
      } catch (err) {
        console.log("Delete comment failed");
      }
    },
    handleCommentDelete: async function(comment) {
      const self = this;
      this.commentToDelete = comment;
      wx.showModal({
        title: "删除评论",
        content: "目前不支持Archive，删除不可逆",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            self.commentModalConfirm();
          } else if (res.cancel) {
            console.log("用户点击取消");
            self.commentModalCancel();
          }
        }
      });
    },
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
  z-index: 5;
  height: 100%;
  /* padding: 0px 162px 0px 0px; */
  width: 100%;
  padding: 0px 0px 300px 0px;
}

.b-option-sheet {
  z-index: 20;
  position: fixed;
  background-color: rgba(66, 66, 66, 0.6);
  /* border: 10px solid black; */
  width: 100vw;
  height: 100vh;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
