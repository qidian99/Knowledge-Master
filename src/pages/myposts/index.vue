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
      />
    </div>
  </div>
</template>

<script>
import PostCard from "@/components/post-card";
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
  components: { PostCard },
  data() {
    return {
      myposts: []
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
    modalConfirm: async function(post) {
      try {
        const res = await deletePost(post.postId);
        console.log("Delete res", res);
        this.removePost(post);
        const index = this.myposts.find(p => p.postId === post.postId);
        this.myposts.splice(index, 1);
      } catch (err) {
        console.log("Delete post failed");
      }
    },
    modalCancel: function() {
    },
    handleDelete: async function(post) {
      const self = this
      wx.showModal({
        title: '删除帖子',
        content: '目前不支持Archive，删除不可逆',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            self.modalConfirm(post)
          } else if (res.cancel) {
            console.log('用户点击取消')
            self.modalCancel()
          }
        }
      })
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
</style>

<style>
page {
  background: rgba(0, 0, 0, 0.08);
}
</style>