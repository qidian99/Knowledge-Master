<template>
  <div class="page">
    <div class="weui-cells__title">标题</div>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <input :value="title" @input="handleTitleInput" class="weui-input" maxlength="30" placeholder="请输入标题" />
        </div>
      </div>
    </div>

    <div class="weui-cells__title">内容</div>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <textarea
            maxlength="200"
            :value="body"
            class
            placeholder="请输入内容"
            style="height: 3.3em"
            @input="handleBodyInput"
          />
          <div class="weui-textarea-counter" :class="{textErr: bodyError}">{{bodyTextLength + '/' + BODY_LIMIT}}</div>
        </div>
      </div>
    </div>

    <div class="weui-btn-area">
      <button class="weui-btn" :style="submitStyle" type="primary" @click="submitPost" :disabled="bodyError">确定</button>
    </div>
  </div>
</template>

<script>
import TopicCard from "@/components/topic-card";
import { createPostMutation } from "../../utils/queries";
import { createPost } from "../../utils/post";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";

const BODY_LIMIT = 200;
export default {
  components: { TopicCard },
  data() {
    return {
      title: "",
      body: "",
      BODY_LIMIT,
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "发布帖子"
    });
  },
  async mounted() {},
  computed: {
    ...mapState({
      topic: state => state.topics.topic
    }),
    ...mapGetters("topics", {
      topic: "topic"
    }),
    ...mapGetters("posts", {
      posts: "posts"
    }),
    submitStyle: function () {
      return "background-color:" + blue.primary;
    },
    bodyTextLength: function () {
      return this.body.length;
    },
    bodyError: function () {
      return this.body.length > BODY_LIMIT
    }
  },
  methods: {
    ...mapActions("topics", {
      setUserTopic: 'setUserTopic'
    }),
    ...mapActions("posts", {
      setPosts: 'setPosts'
    }),
    handleBodyInput: function (e) {
      const {
        mp: {
          detail: { value }
        }
      } = e;
      this.body = value;
    },
    handleTitleInput: function (e) {
      const {
        mp: {
          detail: { value }
        }
      } = e;
      this.title = value;
    },
    submitPost: async function () {

      const post = await createPost(this.topic.topicId, this.title, this.body);
      console.log(post)
      this.setPosts([post, ...this.posts])

      this.body = ''
      this.title = ''

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