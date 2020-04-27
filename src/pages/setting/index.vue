<template>
  <div class="container">
    <SettingOption v-if="user" :src="user.avatarUrl" title="头像" />
    <div class="setting-option-divider" />
    <SettingOption v-if="user" :text="user.nickName" title="名字"/>
    <div class="setting-option-divider" />
    <navigator class="b-nav" url="/pages/topics/main" hover-class="navigator-hover">
      <SettingOption navigation="topics" title="选择话题"/>
    </navigator>
    <WXAuthorize @clickAuthorize="handleClick" />

  </div>
</template>

<script>
import WXAuthorize from "@/components/wx-authorize";
import { mapGetters, mapState, mapMutations } from "vuex";
import { UPDATE_USER_INFO } from "@/store/mutation-types";
import SettingOption from '@/components/setting-option'

export default {
  components: {
    WXAuthorize,
    SettingOption
  },
  created() {
    console.log("Setting: user profile", this.user, this.profileKeys);
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      user: state => state.setting.userInfo
    }),
    ...mapGetters("setting", {
      userInfo: "userInfo"
    }),
    profileKeys: function () {
      return Object.keys(this.user || {})
    },
  },
  methods: {
    ...mapMutations([`setting/UPDATE_USER_INFO`]),
    handleClick({ user }) {
      console.log("GOT USER FROM AUTHORIZE", user);
      this[`setting/UPDATE_USER_INFO`](user);
      console.log(this.user);
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
/* .b-nav:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1rpx solid #d9d9d9;
  color: #d9d9d9;
  left: 15px;
} */


</style>