<template>
  <div class="container">
    <div class="btn">
      <button @click="handleSubscription">订阅单次评论推送</button>
    </div>
    <div class="btn">
      <button @click="handleSendMessage">测试一次性评论</button>
    </div>
    <Uploader @upLoadSuccess="onFileUploaded" />
  </div>
</template>


<script>
import HistoryCard from "@/components/history-card";
import Uploader from "@/components/uploader";
import { createPostMutation } from "../../utils/queries";
import {
  createPost,
  setUsername,
  fetchPost,
  sendTemplateMessage
} from "../../utils/post";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";
const COS = require("../../js/cos-wx-sdk-v5");

export default {
  components: { HistoryCard, Uploader },
  data() {
    return {};
  },
  onLoad(query) {
    wx.setNavigationBarTitle({
      title: "内测功能"
    });
    console.log("QUERY", query.postId);
  },
  async mounted() {},
  computed: {
    ...mapGetters("post", {
      posts: "history"
    })
  },
  methods: {
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
        }
      });
    },
    async handleSendMessage() {
      await sendTemplateMessage();
    },
    async onFileUploaded(res) {
      const host = process.env.API_BASE_URL;

      var Bucket = "km-1256664426";
      var Region = "ap-beijing";

      console.log(Bucket, res);

      // 初始化实例
      var cos = new COS({
        getAuthorization: function(options, callback) {
          // 异步获取签名
          wx.request({
            url: "http://localhost:4002/sts", // 步骤二提供的签名接口
            data: {
              Method: options.Method,
              Key: options.Key
            },
            dataType: "json",
            success: function(result) {
              var data = result.data;
              var credentials = data && data.credentials;
              if (!data || !credentials)
                return console.error("credentials invalid");
              callback({
                TmpSecretId: credentials.tmpSecretId,
                TmpSecretKey: credentials.tmpSecretKey,
                XCosSecurityToken: credentials.sessionToken,
                StartTime: data.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                ExpiredTime: data.expiredTime // 时间戳，单位秒，如：1580000900
              });
            }
          });
        }
      });

      console.log(res);
      
      var filePath = res.tempFiles[0].path;
      var filename = filePath.substr(filePath.lastIndexOf("/") + 1);
      cos.postObject(
        {
          Bucket: Bucket,
          Region: Region,
          Key: filename,
          FilePath: filePath,
          onProgress: function(info) {
            console.log('on progress', JSON.stringify(info));
          }
        },
        function(err, data) {
          console.log('err', err || data);
        }
      );

      // wx.uploadFile({
      //   url: host, //仅为示例，非真实的接口地址
      //   filePath: tempFilePaths[0],
      //   name: "file",
      //   formData: {
      //     user: "test"
      //   },
      //   success(res) {
      //     const data = res.data;
      //     //do something
      //   }
      // });
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
</style>