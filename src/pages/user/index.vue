<template>
  <div class="container">
    <SettingOption v-if="user.avatarUrl" :src="user.avatarUrl" title="ta的头像" />
    <SettingOption v-else text="未知" title="ta的头像" />
    <div class="setting-option-divider" />
    <SettingOption v-if="user.nickName" :text="user.nickName" title="ta的名字" />
    <SettingOption v-else text="未知" title="ta的名字" />
    <div class="setting-option-divider" />
    <SettingOption title="ta的昵称" :text="username" />
    <div class="setting-option-divider" />
    <SettingOption title="ta的版块" :text="subscription" />
    <div class="setting-option-divider" />
    <SettingOption title="ta的画廊" :text="(files.length !== 0) ? '' : '未知'" />
    <UserGallery ref="imgs" :initialFileList="files" />
  </div>
</template>

<script>
import WXAuthorize from "@/components/wx-authorize";
import { mapGetters, mapState, mapActions } from "vuex";
import { UPDATE_USER_INFO } from "@/store/mutation-types";
import SettingOption from "@/components/setting-option";
import UserGallery from "@/components/user-gallery";
import { updateUserProfile } from "../../utils/user";
import { fetchPosts } from "../../client/post";
import { registerQuery, postsQueryWithTopic } from "../../utils/queries";

export default {
  components: {
    WXAuthorize,
    SettingOption,
    UserGallery
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "用户资料"
    });
  },
  created() {
    console.log("View other user: ", this.user);
  },
  mounted() {
    this.$refs.imgs.clearFiles();
    this.$refs.imgs.setFiles(
      ((this.user && this.user.gallery) || []).map(url => "https://" + url)
    );
  },
  data() {
    return {
      modalHidden: true
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.otherUser
    }),
    subscription: function() {
      if (this.user && this.user.subscription && this.user.subscription.name) {
        return this.user.subscription.name;
      } else {
        return "未知";
      }
    },
    username: function() {
      if (this.user && this.user.username) return this.user.username;
      return "未知";
    },
    files: function() {
      return ((this.user && this.user.gallery) || []).map(
        url => "https://" + url
      );
    }
  },
  methods: {}
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
  align-items: center;
}

.clear-storage {
  margin: 10px, 10px, 0px;
  padding: 5px 10px;
}
</style>