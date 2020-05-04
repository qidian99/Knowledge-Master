<template>
  <div class="container">
    <div class="b-posts" v-for="(post,index) in myposts" :key="index">
      <PostCard
        :setLikesOfAPost="setLikesOfAPost"
        :index="index"
        :id="post.postId"
        :post="post"
        @clickpost="handlePostClick"
        @clickdelete="handleDelete"
        @clickoption="handleShowOptionSheet"
      />
    </div>
    <div class="b-option-sheet" v-if="optionPost" @click="closeOptionSheet" transition="expand">
      <OptionSheet :optionPost="optionPost" @optiondelete="handleDelete" @optionedit="handleEdit" />
    </div>
  </div>
</template>

<script>
import PostCard from "@/components/post-card";
import OptionSheet from "@/components/option-sheet";
import {
  registerQuery,
  postsQueryWithoutTopic,
  postsQueryWithTopic
} from "../../utils/queries";
import { fetchPosts, fetchPost, deletePost, findUserPosts, clickPostAndNavigate } from "../../utils/post";
import { currentUser } from "../../utils/user";
import { mapGetters, mapState, mapActions } from "vuex";

import { blue } from "@ant-design/colors";

export default {
  components: { PostCard, OptionSheet },
  data() {
    return {
      myposts: [],
      optionPost: null
    };
  },
  onShow: async function() {
     wx.setNavigationBarTitle({
      title:'我的帖子'
    });
    const posts = await findUserPosts();
    this.myposts = posts || []
  },
  computed: {
    ...mapGetters("topics", {
      topic: "topic"
    }),
    ...mapGetters("posts", {
      posts: "posts"
    }),
    ...mapGetters("auth", {
      token: "token"
    })
  },
  methods: {
    ...mapActions("edit", {
      editPost: "editPost"
    }),
    ...mapActions({
      removePost: "removePost"
    }),
    ...mapActions("posts", {
      setPosts: "setPosts",
      deletePost: "deletePost",
      setRefresh: "setRefresh",
      updatePost: "updatePost",
      setLikesOfAPost: "setLikesOfAPost"
    }),
    ...mapActions("user", {
      setViewOtherUser: "setViewOtherUser"
    }),
    ...mapActions("topics", {
      setUserTopic: "setUserTopic"
    }),
    ...mapActions("auth", {
      setAuthToken: "setAuthToken",
      setUser: "setUser"
    }),
    ...mapActions("post", {
      viewPost: "viewPost"
    }),
    async handlePostClick(post) {
      clickPostAndNavigate(this, post)
    },
    modalConfirm: async function() {
      try {
        const res = await deletePost(this.post.postId);
        console.log("Delete res", res);
        this.optionPost = null;
        this.removePost(this.post);
        wx.navigateBack();
      } catch (err) {
        console.log("Delete post failed");
      }
    },
    modalCancel: function() {},
    handleDelete: async function(post) {
      const self = this;
      wx.showModal({
        title: "删除帖子",
        content: "目前不支持Archive，删除不可逆",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            self.modalConfirm();
          } else if (res.cancel) {
            console.log("用户点击取消");
            self.modalCancel();
          }
        }
      });
    },
    handleEdit: function(post) {
      this.editPost(post);
      this.optionPost = null;
      wx.navigateTo({
        url: "/pages/editPost/main"
      });
    },
    handleViewUser: async function(user) {
      console.log("other user clicked", user);
      this.setViewOtherUser(user);
      wx.navigateTo({
        url: "/pages/user/main"
      });
    },
    handleShowOptionSheet: function(optionPost) {
      // console.log("clicking option sheet", this.optionPost)
      this.optionPost = optionPost
    },
    closeOptionSheet: function() {
      this.optionPost = null
    },
  }
};

</script>

<style scoped>
.container {
  background-color: transparent;
  /* background-color: rgba(0, 0, 0, 0.08); */
}
.b-posts {
  height: auto;
  display: inline-block;
  width: 90%;
  margin: 5% 5% 5% 5%;
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

<style>
page {
  background: rgba(0, 0, 0, 0.08);
}
</style>