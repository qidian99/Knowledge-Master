<template>
  <div class="container">
    <div class="b-posts" v-for="(post,index) in posts" :key="index">
      <HistoryCard
        :index="index"
        :id="post.postId"
        :post="post"
        @clickhistory="handlePostClick"
      />
    </div>
  </div>
</template>

<script>
import HistoryCard from "@/components/history-card";
import { createPostMutation } from "../../utils/queries";
import { createPost, setUsername, fetchPost, clickPostAndNavigate } from "../../utils/post";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  components: { HistoryCard },
  data() {
    return {
      forceRefresh: true
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "浏览历史"
    });
    console.log("history", this.posts);
  },
  async mounted() {},
  computed: {
    ...mapGetters("post", {
      posts: "history"
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
    ...mapActions("post", {
      viewPost: "viewPost"
    }),
    async handlePostClick(post) {
      clickPostAndNavigate(this, post)
    }
  }
};
</script>

<style scoped>
.b-posts {
  height: auto;
  display: inline-block;
  width: 90%;
  margin: 5% 5% 5% 5%;
}

.container {
  display: block;
  background-color: transparent;
  /* background-color: rgba(0, 0, 0, 0.08); */
}
</style>

<style>
page{
  background: rgba(0, 0, 0, 0.08);;
}
</style>