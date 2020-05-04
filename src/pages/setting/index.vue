<template>
  <div class="container">
    <SettingOption v-if="user" :src="user.avatarUrl" title="头像" />
    <div class="setting-option-divider" />
    <SettingOption v-if="user" :text="user.nickName" title="名字" />
    <div class="setting-option-divider" />
    <navigator class="b-nav" url="/pages/username/main" hover-class="navigator-hover">
      <SettingOption navigation="username" title="设置昵称" :text="username" />
    </navigator>
    <div class="setting-option-divider" />
    <navigator class="b-nav" url="/pages/topics/main" hover-class="navigator-hover">
      <SettingOption navigation="topics" title="选择版块" :text="topic.name" />
    </navigator>
    <div class="setting-option-divider" />
    <navigator class="b-nav" url="/pages/history/main" hover-class="navigator-hover">
      <SettingOption navigation="history" title="浏览历史" />
    </navigator>
    <div class="setting-option-divider" />
    <navigator class="b-nav" url="/pages/myposts/main" hover-class="navigator-hover">
      <SettingOption navigation="myposts" title="我的帖子" />
    </navigator>
    <div class="setting-option-divider" />
    <navigator class="b-nav" url="/pages/gallery/main" hover-class="navigator-hover">
      <SettingOption navigation="gallery" title="我的画廊" />
    </navigator>
    <WXAuthorize @clickAuthorize="handleClick" />
    <div class="clear-storage">
      <button @click="handleClear">清空本地缓存</button>
    </div>
    <!-- <modal title="清空本地缓存" confirm-text="确定" cancel-text="取消" :hidden="modalHidden" @confirm="modalConfirm" @cancel="modalCancel">
      本地历史，帖子将被删除。
    </modal>-->
  </div>
</template>

<script>
import WXAuthorize from "@/components/wx-authorize";
import { mapGetters, mapState, mapActions } from "vuex";
import { UPDATE_USER_INFO } from "@/store/mutation-types";
import SettingOption from "@/components/setting-option";
import { updateUserProfile } from "../../utils/user";
import { fetchPosts } from "../../utils/post";
import { registerQuery, postsQueryWithTopic } from "../../utils/queries";

export default {
  components: {
    WXAuthorize,
    SettingOption
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "设置"
    });
  },
  created() {
    console.log("Setting: user profile", this.user, this.profileKeys);
  },
  data() {
    return {
      modalHidden: true
    };
  },
  computed: {
    ...mapState({
      // user: state => state.setting.userInfo
      user: state => state.auth.user
    }),
    ...mapGetters("auth", {
      userInfo: "user"
    }),
    ...mapGetters("topics", {
      topic: "topic"
    }),
    profileKeys: function() {
      return Object.keys(this.user || {});
    },
    username: function() {
      if (this.userInfo && this.userInfo.username) {
        return this.userInfo.username
      };
      return ''
    }
  },
  methods: {
    ...mapActions("auth", {
      setUser: "setUser",
      setAuthToken: "setAuthToken"
    }),
    ...mapActions("posts", {
      setPosts: "setPosts"
    }),
    ...mapActions("topics", {
      setUserTopic: "setUserTopic"
    }),
    ...mapActions({
      clearAll: "clearAll"
    }),
    ...mapActions("setting", {
      updateUserInfo: "updateUserInfo"
    }),
    modalConfirm: function(e) {
      const self = this;
      self.modalHidden = true;
      try {
        self.clearAll();
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
        // wx.clearStorageSync();
      } catch (e) {
        console.log(e);
      }
    },
    modalCancel: function(e) {
      this.modalHidden = true;
    },
    async handleClick({ user }) {
      console.log("GOT USER FROM AUTHORIZE", user);
      this.updateUserInfo(user);
      const profile = await updateUserProfile(user);
      console.log("New profile", profile);
      this.setUser(profile);
    },
    async handleClear() {
      const self = this;
      wx.showModal({
        title: "清空本地缓存",
        content: "本地历史记录等数据将被清除",
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
    }
  }
};
</script>

<style scoped>
.container {
  background-color: white;
}

.setting-options {
  height: 100px;
  background-color: saddlebrown;
}
.message {
  color: red;
  padding: 10px;
  text-align: center;
}

.setting-option-divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-left: 5%;
  width: 90%;
}

.b-nav {
  margin: 10px 15px 10px 15px;
  /* position: relative; */
  /* -webkit-box-align: center;
  -webkit-align-items: center; */
  align-items: center;
}

.clear-storage {
  margin: 10px, 10px, 0px;
  padding: 5px 10px;
}
</style>