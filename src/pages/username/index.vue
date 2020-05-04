<template>
  <div class="page">
    <div class="weui-cells__title">昵称</div>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <textarea
            maxlength="20"
            :value="username"
            class
            placeholder="请输入昵称"
            style="height: 3.3em"
            @input="handleUsernameInput"
          />
          <div class="weui-textarea-counter" :class="{textErr: usernameError}">{{bodyTextLength + '/' + USERNAME_LIMIT}}</div>
        </div>
      </div>
    </div>

    <div class="weui-btn-area">
      <button class="weui-btn" :style="submitStyle" type="primary" @click="submitPost" :disabled="usernameError">确定</button>
    </div>
  </div>
</template>

<script>
import TopicCard from "@/components/topic-card";
import { createPostMutation } from "../../utils/queries";
import { createPost, setUsername } from "../../utils/post";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";

const USERNAME_LIMIT = 20;
export default {
  components: { TopicCard },
  data() {
    return {
      username: this.oldUsername || "",
      USERNAME_LIMIT,
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "设置用户名"
    });
  },
  async mounted() {},
  computed: {
    ...mapGetters("auth", {
      user: "user"
    }),
    oldUsername: function () {
      if (this.user || this.user.username) {
        return this.user.username;
      }
      return ''
    },
    submitStyle: function () {
      return "background-color:" + blue.primary;
    },
    bodyTextLength: function () {
      return this.username.length;
    },
    usernameError: function () {
      return this.username.length > USERNAME_LIMIT
    }
  },
  methods: {
    ...mapActions("auth", {
      setUser: "setUser"
    }),
    handleUsernameInput: function (e) {
      const {
        mp: {
          detail: { value }
        }
      } = e;
      this.username = value;
    },
    submitPost: async function () {
      console.log('New profile', this.username);

      const profile = await setUsername(this.username);
      console.log('New profile', profile);
      this.setUser(profile)

      this.username = ''
      wx.navigateBack()
    }
  }
};
</script>

<style scoped>
.weui-cells__title {
  padding-bottom: 4px;
}

.textErr {
  color: red;
}
</style>