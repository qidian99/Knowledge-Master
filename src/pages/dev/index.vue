<template>
  <div class="container">
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
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "内测功能"
    });
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
  }
};
</script>

<style scoped>
</style>