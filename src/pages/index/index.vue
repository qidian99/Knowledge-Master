<template>
  <div>
    <div v-if="topic" class="container" @click="clickHandle">
      <navigator class="b-edit-icon" url="/pages/newPost/main" hover-class="navigator-hover">
        <!-- <div class="b-edit-icon"> -->
        <img class="edit-icon" :style="editIconStyle" src="/static/icons/edit-square-white.svg" />
        <!-- </div> -->
      </navigator>
      <!-- <div class="message">{{msg}}</div>
        <ClickCounter :init-num='10' @clicknum="handleClickNum" />
      <UserStatus />-->
      <!-- <div class="topic-hint" v-if="topic">
          你正在浏览{{topic.name}}话题
          <div class="hint-posts-divisor" />
        </div>
      <div class="divisor-placeholder" />-->
      <div class="b-posts" v-for="(post,index) in posts" :key="index">
        <PostCard
          v-if="test"
          :index="index"
          :id="post.postId"
          :post="post"
          @clickpost="handlePostClick"
        />
      </div>
    </div>
    <div class="dashboard-no-topic" :style="noTopicStyle" v-else>快去选择话题吧</div>
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
import { fetchPosts } from "../../utils/post";
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import { SET_AUTH_TOKEN, SET_USER_POST } from "../../store/mutation-types";
import { blue } from "@ant-design/colors";
import store from "../../store";

export default {
  components: { ClickCounter, UserStatus, WXAuthorize, PostCard },
  data() {
    return {
      test: true
    };
  },
  onLoad() {
    if (this.topic) {
      wx.setNavigationBarTitle({
        title: this.topic.name
      });
      return;
    }
    wx.setNavigationBarTitle({
      title: "主页"
    });
  },
  async created() {
    self = this;
    if (!self.token) {
      wx.login({
        async success(res) {
          console.log("WXAuthorize Mounted", res);
          if (res.code) {
            // 这里可以把code传给后台，后台用此获取openid及session_key
            console.log("Code", res.code);
            await self.registerOpenid(res.code);
            // const posts = await fetchPosts(postsQueryWithoutTopic);
            // self[`posts/${SET_USER_POST}`](posts)
          }
        }
      });
    } else if (self.topic && self.topic.name.length > 0) {
      console.log("Fetching all post under topic:", self.topic.name);
      const posts = await fetchPosts(postsQueryWithTopic, self.topic.topicId);
      self[`posts/${SET_USER_POST}`](posts);
    }
  },
  onShow: function() {
    console.log("On show index posts card");
    const self = this;
    const posts = store.state.posts.posts;
    // console.log("Get Posts", posts)
    // this.posts = posts;
    this.posts = Object.assign({}, this.posts);
    this.test = false;
    setTimeout(function() {
      self.test = true;
    }, 100);
    // this[`posts/${SET_USER_POST}`](posts)
    // this.$forceUpdate()
    console.log("Get Posts", this.posts);
  },
  computed: {
    noTopicStyle: function() {
      // console.log('1111')
      const screenHeight = wx.getSystemInfoSync().windowHeight;
      // console.log(screenHeight)
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
    ...mapActions("post", {
      viewPost: "viewPost"
    }),
    ...mapMutations([`auth/${SET_AUTH_TOKEN}`, `posts/${SET_USER_POST}`]),
    handlePostClick(post) {
      console.log("Prepare to navigate to", post);
      this.viewPost(post);
      console.log("Prepare to navigate to 2", post);

      wx.navigateTo({
        url: "/pages/post/main"
      });
    },
    clickHandle() {
      this.msg = "Clicked!!!!!!";
    },
    handleClickNum(data) {
      console.log(">>>>", data.num);
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
      self[`auth/${SET_AUTH_TOKEN}`]({ token, user });
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