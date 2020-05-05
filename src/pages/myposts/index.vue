<template>
  <div class="container">
    <div class="b-posts" v-for="(post,index) in myposts" :key="index">
      <PostCard
        :setLikesOfAPost="setLikesOfAPost"
        :index="index"
        :id="post.postId"
        :post="post"
        @clickpost="clickPostAndNavigate"
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
} from "../../client/graphql";
import {
  findUserPosts,
  createComment,
  deleteComment,
  fetchPosts,
  fetchPost,
  deletePost,
  clickPostAndNavigate
} from "../../client/post";
import { currentUser, registerOpenid } from "../../client/user";
import { handleViewUser } from "../../utils/user";
import {
  handleDelete,
  handleShowOptionSheet,
  closeOptionSheet,
  handleEdit
} from "../../utils/option";
import { mapGetters, mapState, mapActions } from "vuex";

import { blue } from "@ant-design/colors";

export default {
  components: { PostCard, OptionSheet },
  data() {
    return {
      myposts: [],
      clickPostAndNavigate,
      handleDelete,
      handleShowOptionSheet,
      closeOptionSheet,
      clickPostAndNavigate,
      handleEdit,
      handleViewUser,
      registerOpenid
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
    ...mapGetters("option", {
      optionPost: "post"
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