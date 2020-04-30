<template>
  <div class="container">
    <div class="b-posts" v-for="(post,index) in posts" :key="index">
      <HistoryCard
        v-if="forceRefresh"
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
import { createPost, setUsername, fetchPost } from "../../utils/post";
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
    ...mapActions("post", {
      viewPost: "viewPost"
    }),
    ...mapActions("posts", {
      updatePost: "updatePost"
    }),
    async handlePostClick(post) {
      let newPost;

      let offlineMode = false;
      if (!offlineMode) {
        newPost = await fetchPost(post.postId);
        console.log("newPost", newPost);
        this.updatePost({ newPost, post }); // will check whether the post falls under the same category;
        if (!newPost) {
          // alert('帖子不存在')
          wx.showToast({
            title: "帖子不存在",
            icon: "loading",
            duration: 1200,
            mask: true
          });
        } else {
          this.viewPost(newPost);
          wx.navigateTo({
            url: "/pages/post/main"
          });
        }
      } else {
        // 离线浏览
        this.viewPost(post);
        wx.navigateTo({
          url: "/pages/post/main"
        });
      }
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