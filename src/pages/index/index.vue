<template>
  <div>
    <div v-if="topic" class="container" @click="clickHandle">
      <navigator class="b-edit-icon" url="/pages/newPost/main" hover-class="navigator-hover">
        <img class="edit-icon" :style="editIconStyle" src="/static/icons/edit-square-white.svg" />
      </navigator>
      <div
        class="b-posts"
        v-for="(post,index) in posts"
        :key="index"
        style="transition = 'all 0.05s';"
      >
        <PostCard
          :setLikesOfAPost="setLikesOfAPost"
          v-if="forceRefresh"
          :index="index"
          :id="post.postId"
          :post="post"
          @clickpost="clickPostAndNavigate"
          @clickdelete="handleDelete"
          @clickuser="handleViewUser"
          @clickoption="handleShowOptionSheet"
          :thumbnailStyle="{width: '24vw', height: '24vw'}"
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
    <!-- <modal
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
import ClickCounter from "@/components/click-counter";
import UserStatus from "@/components/user-status";
import WXAuthorize from "@/components/wx-authorize";
import PostCard from "@/components/post-card";
import OptionSheet from "@/components/option-sheet";
import {
  postsQueryWithTopic
} from "../../utils/queries";
import {
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
import { mapGetters, mapState, mapActions } from "vuex";

import { blue } from "@ant-design/colors";
import store from "../../store";

export default {
  components: { ClickCounter, UserStatus, WXAuthorize, PostCard, OptionSheet },
  data() {
    return {
      forceRefresh: true,
      handleDelete,
      handleShowOptionSheet,
      closeOptionSheet,
      clickPostAndNavigate,
      handleEdit,
      handleViewUser,
      registerOpenid
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
      return;
    } else if (self.topic && self.topic.name.length > 0) {
      console.log("Fetching all post under topic:", self.topic.name);
      const posts = await fetchPosts(postsQueryWithTopic, self.topic.topicId);
      self.setPosts(posts);
      // self.forceRefresh = false;
      // self.$nextTick(() => {
      //   // Add the component back in
      //   self.forceRefresh = true;
      //   self.setRefresh(false);
      // });
    }
    const user = await currentUser();
    self.setUser(user);
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
      setTimeout(() => {
        // Add the component back in
        this.forceRefresh = true;
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
    ...mapGetters("option", {
      optionPost: "post"
    }),
    ...mapGetters("auth", {
      token: "token"
    })
  },
  methods: {
    ...mapActions("posts", {
      setPosts: "setPosts",
      setRefresh: "setRefresh",
      setLikesOfAPost: "setLikesOfAPost"
    }),
    ...mapActions("topics", {
      setUserTopic: "setUserTopic"
    }),
    ...mapActions("auth", {
      setAuthToken: "setAuthToken",
      setUser: "setUser"
    }),
    onShowTopicClick: function() {
      wx.navigateTo({url: "/pages/topics/main"});
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
  /* min-height: 2000px; */
  background-color: transparent;
  /* background-color: rgba(0, 0, 0, 0.08); */
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

.b-option-sheet {
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