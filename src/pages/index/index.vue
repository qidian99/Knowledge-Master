<template>
  <div>
    <div v-if="topic" class="container" @click="clickHandle">
      <navigator class="b-edit-icon" url="/pages/newPost/main" hover-class="navigator-hover">
        <img class="edit-icon" :style="editIconStyle" src="/static/icons/edit-square-white.svg" />
      </navigator>
      <div class="b-posts" v-for="(post,index) in posts" :key="index">
        <PostCard
          :setLikesOfAPost="setLikesOfAPost"
          v-if="forceRefresh"
          :index="index"
          :id="post.postId"
          :post="post"
          @clickpost="handlePostClick"
          @clickdelete="handleDelete"
        />
      </div>
    </div>
    <div @click="onShowTopicClick" class="dashboard-no-topic" :style="noTopicStyle" v-else>快去选择话题吧</div>
    <div
      @click="onShowTopicClick"
      class="dashboard-no-topic"
      :style="noTopicStyle"
      v-if="posts.length === 0"
    >切换话题</div>
    <modal
      title="删除帖子"
      confirm-text="确定"
      cancel-text="取消"
      :hidden="modalHidden"
      @confirm="modalConfirm"
      @cancel="modalCancel"
    >你可别后悔</modal>
  </div>
</template>

<script>
import ClickCounter from "@/components/click-counter";
import UserStatus from "@/components/user-status";
import WXAuthorize from "@/components/wx-authorize";
import PostCard from "@/components/post-card";
import {
  registerQuery,
  postsQueryWithoutTopic,
  postsQueryWithTopic
} from "../../utils/queries";
import { fetchPosts, fetchPost, deletePost } from "../../utils/post";
import { mapGetters, mapState, mapActions } from "vuex";

import { blue } from "@ant-design/colors";
import store from "../../store";

export default {
  components: { ClickCounter, UserStatus, WXAuthorize, PostCard },
  data() {
    return {
      forceRefresh: true,
      modalHidden: true,
      postToDelete: null
    };
  },
  async created() {
    self = this;
    if (!self.token) {
      wx.login({
        async success(res) {
          console.log("WXAuthorize Mounted", res);
          if (res.code) {
            // send code to backend
            console.log("Code", res.code);
            self.registerOpenid(res.code);
          }
        }
      });
    } else if (self.topic && self.topic.name.length > 0) {
      console.log("Fetching all post under topic:", self.topic.name);
      const posts = await fetchPosts(postsQueryWithTopic, self.topic.topicId);
      self.setPosts(posts);
    }
  },
  onShow: function() {
    if (this.topic) {
      wx.setNavigationBarTitle({
        title: this.topic.name
      });
    } else {
      wx.setNavigationBarTitle({
        title: "主页"
      });
    }
    const self = this;
    const posts = store.state.posts.posts;
    const refresh = store.state.posts.refresh;

    if (refresh) {
      this.forceRefresh = false;
      setTimeout(function() {
        self.forceRefresh = true;
        self.setRefresh(false);
      }, 50);
    }
  },
  async onPullDownRefresh() {
    console.log("下拉刷新");
    console.log("Fetching all post under topic:", self.topic.name);
    const posts = await fetchPosts(postsQueryWithTopic, self.topic.topicId);
    this.setPosts(posts);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    console.log("上拉加载");
  },

  computed: {
    noTopicStyle: function() {
      const screenHeight = wx.getSystemInfoSync().windowHeight;
      return "height: " + screenHeight + "px";
    },
    editIconStyle: function() {
      return "background-color:" + blue.primary;
    },
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
    ...mapActions("posts", {
      setLikesOfAPost: "setLikesOfAPost"
    }),
    ...mapActions({
      removePost: "removePost"
    }),
    ...mapActions("posts", {
      setPosts: "setPosts"
    }),
    ...mapActions("posts", {
      setRefresh: "setRefresh"
    }),
    ...mapActions("topics", {
      setUserTopic: "setUserTopic"
    }),
    ...mapActions("auth", {
      setAuthToken: "setAuthToken"
    }),
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
    },
    async registerOpenid(code) {
      const self = this;
      const payload = {
        query: registerQuery,
        variables: {
          code
        }
      };
      const r = await self.$http.post({
        payload
      });

      const {
        data: {
          registerOpenid: { user, token }
        }
      } = r;

      console.log("Registered, token is:", token, user);

      // set auth token
      self.setAuthToken({ token, user });

      if (user.subscription) {
        // set subscription
        self.setUserTopic(user.subscription);
        wx.setNavigationBarTitle({
          title: user.subscription.name
        });
        console.log("Fetching all post under topic:", self.topic.name);
        const posts = await fetchPosts(postsQueryWithTopic, self.topic.topicId);
        self.setPosts(posts);
      }
    },
    onShowTopicClick: function() {
      wx.navigateTo({
        url: "/pages/topics/main"
      });
    },
    modalConfirm: async function() {
      this.modalHidden = true;
      try {
        const res = await deletePost(this.postToDelete.postId);
        console.log("Delete res", res);
        this.removePost(this.postToDelete);
        this.postToDelete = null;
      } catch (err) {
        console.log("Delete post failed");
      }
    },
    modalCancel: function() {
      this.postToDelete = null;
      this.modalHidden = true;
    },
    handleDelete: async function(post) {
      this.postToDelete = post;
      this.modalHidden = false;
    }
  }
};
</script>

<style scoped>
.b-edit-icon {
  position: fixed;
  bottom: 10px;
  right: 20px;
  border-radius: 50%;
}
.edit-icon {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 50%;
  padding: 8px;
  width: 40px;
  height: 40px;
}

.hint-posts-divisor {
  border: 1px dashed black;
  height: 2%;
  margin-top: 10px;
}

.topic-hint {
  padding: 10px 0 0px;
  text-align: center;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  background-color: #ececec;
}

.container {
  display: block;
  /* background-color: transparent; */
  background-color: rgba(0, 0, 0, 0.08);
}

.b-posts {
  height: auto;
  display: inline-block;
  width: 90%;
  margin: 5% 5% 5% 5%;
}

.divisor-placeholder {
  padding-top: 13%;
  background-color: transparent;
}

.dashboard-no-topic {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>