<template>
  <div class="container" @click="clickHandle">
    <div class="b-edit-icon">
      <img class="edit-icon" :style="editIconStyle" src="/static/icons/edit-square-white.svg" />
    </div>
    <!-- <div class="message">{{msg}}</div>
    <ClickCounter :init-num='10' @clicknum="handleClickNum" />
    <UserStatus />-->
    <div class="topic-hint" v-if="topic">
      你正在浏览{{topic.name}}话题
      <div class="hint-posts-divisor" />
    </div>
    <div class="divisor-placeholder" />
    <div class="b-posts" v-for="(post,index) in posts" :key="index">
      <PostCard :index="index" :id="post.postId" :post="post" />
    </div>
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

export default {
  components: { ClickCounter, UserStatus, WXAuthorize, PostCard },
  data() {
    return {
    };
  },
  async created() {
    self = this;
    // console.log("topic: ", self.topic)
    if (!self.token) {
      wx.login({
        async success(res) {
          console.log("WXAuthorize Mounted", res);
          if (res.code) {
            // 这里可以把code传给后台，后台用此获取openid及session_key
            console.log("Code", res.code);
            await self.registerOpenid(res.code);
            const posts = await fetchPosts(postsQueryWithoutTopic);
            self[`posts/${SET_USER_POST}`](posts)
          }
        }
      });
    } else if (self.topic && self.topic.name.length > 0) {
      console.log("Fetching all post under topic:", self.topic.name);
      const posts = await fetchPosts(postsQueryWithTopic, self.topic.topicId);
      self[`posts/${SET_USER_POST}`](posts)
    } else {
      const posts = await fetchPosts(postsQueryWithoutTopic);
      self[`posts/${SET_USER_POST}`](posts)
    }
  },
  computed: {
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
    ...mapMutations([`auth/${SET_AUTH_TOKEN}`, `posts/${SET_USER_POST}`]),
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

      console.log("Registered, token is:", token);

      // set auth token
      self[`auth/${SET_AUTH_TOKEN}`](token);
    }
  }
};
</script>

<style scoped>
.b-edit-icon {
  position: fixed;
  bottom: 10px;
  right: 20px;
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
}
</style>