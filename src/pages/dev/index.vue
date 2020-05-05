<template>
  <div class="container">
    <div class="btn">
      <button @click="handleSubscription">订阅单次评论推送</button>
    </div>
    <div class="btn">
      <button @click="handleSendMessage">测试一次性评论</button>
    </div>
    <div class="uploader">用户画廊已加入设置</div>
    <div class="uploader">
      测试 Apollo HTTP Link
      <div v-for="(item, index) in users" :key="index">{{item.username}}</div>
    </div>
    <div class="uploader">
      测试 Apollo Subscription (websocket)
      <div v-if="post">
        <div>新帖ID：{{post.postId}}</div>
        <div>新帖标题：{{post.title}}</div>
        <div>新帖内容：{{post.body}}</div>
      </div>
    </div>
  </div>
</template>


<script>
import HistoryCard from "@/components/history-card";
import Uploader from "@/components/uploader";
import { createPostMutation } from "../../utils/queries";
import { sendTemplateMessage } from "../../utils/post";
import {
  addToGallery,
  deleteFromGallery,
  deleteGallery
} from "../../utils/gallery";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";
import { cos, Bucket, Region } from "../../utils/cos";

import fetch from "@/adapter/fetch";
import websocket from "@/adapter/websocket";

import { execute, makePromise } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import store from "../../store";

const uri = process.env.API_BASE_URL;
const link = new HttpLink({
  uri,
  fetch
});

const operation = {
  query: gql`
    query users {
      users {
        userId
        username
        nickName
        avatarUrl
        sessionKey
      }
    }
  `,
  variables: {} // optional
  // operationName: {} // optional
  // context: {} // optional
  // extensions: {} // optional
};

import { SubscriptionClient } from "subscriptions-transport-ws";

const client = new SubscriptionClient(
  process.env.SUBSCRIPTION_BASE_URL,
  {
    reconnect: true,
    connectionParams: {
      token: store.state.auth.token
    }
  },
  websocket
);

const subOp = {
  query: gql`
    subscription {
      postAdded {
        postId
        title
        body
      }
    }
  `
};

export default {
  components: { HistoryCard, Uploader },
  data() {
    return {
      users: [Object],
      post: Object
    };
  },
  onLoad(query) {
    wx.setNavigationBarTitle({
      title: "内测功能"
    });
    console.log("QUERY", query.postId);
  },
  async mounted() {
    const self = this;
    makePromise(execute(link, operation)).then(({ data }) => {
      self.users = data.users;
      console.log("Data fetch from graphql serer", data);
    });

    client.request(subOp).subscribe({
      next: ({ data }) => {
        const { postId, title, body } = data.postAdded;
        self.post = { postId, title, body };
        console.log('New data!', data)
      },
      error: error => error,
      complete: () => {}
    });
  },
  computed: {
    ...mapGetters("post", {
      posts: "history"
    }),
    ...mapGetters("auth", {
      token: "token",
      user: "user"
    }),
    gallery: function() {
      return ((this.user && this.user.gallery) || []).map(
        url => "https://" + url
      );
    }
  },
  methods: {
    ...mapActions("auth", {
      setUserGallery: "setUserGallery"
    }),
    ...mapActions("post", {
      viewPost: "viewPost"
    }),
    ...mapActions("posts", {
      updatePost: "updatePost"
    }),
    handleSubscription() {
      wx.requestSubscribeMessage({
        tmplIds: [
          // "2mepBLbrGHSh09Em_2cQg9HmL_A8TzyOumpBttQ7R0A",
          "8gB9PBxb7bXmeTAGr97VAqbUFVDH8PGp5HbBaWD__eU"
          // "Uv4JNV81SlEE4lvIGqaFaonlGY5ZofrJ36_oHwWxn74"
        ], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
        success(res) {
          console.log("已授权接收订阅消息");
          wx.showModal({
            title: "已授权订阅提醒",
            showCancel: false,
            success(res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          });
        }
      });
    },
    async handleSendMessage() {
      try {
        await sendTemplateMessage();
        console.log("已发送评论");
        wx.showModal({
          title: "已发送评论",
          showCancel: false,
          success(res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        });
      } catch (err) {
        console.log("评论发送失败");
        wx.showModal({
          title: "评论发送失败",
          showCancel: false,
          success(res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: transparent;
}
.btn {
  margin: 10px, 10px, 0px;
  padding: 5px 10px;
}

.uploader {
  margin: 10px, 10px, 0px;
  padding: 5px 10px;
}
</style>