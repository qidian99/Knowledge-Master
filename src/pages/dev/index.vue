<template>
  <div class="container">
    <div class="btn">
      <button @click="handleSubscription">订阅单次评论推送</button>
    </div>
    <div class="btn">
      <button @click="handleSendMessage">测试一次性评论</button>
    </div>
    <div class="uploader">
      <Uploader
       @upLoadSuccess="onFileUploaded"
       @uploadDelete="onFileDeleted" 
       :initialFileList="gallery"
      />
    </div>
  </div>
</template>


<script>
import HistoryCard from "@/components/history-card";
import Uploader from "@/components/uploader";
import { createPostMutation } from "../../utils/queries";
import {
  addToGallery,
  deleteFromGallery,
  deleteGallery
} from "../../utils/gallery";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";
const COS = require("../../js/cos-wx-sdk-v5");
const Bucket = "km-1256664426";
const Region = "ap-beijing";

// 初始化实例
const cos = new COS({
  getAuthorization: function(options, callback) {
    // 异步获取签名
    wx.request({
      url: process.env.COS_URL, // 步骤二提供的签名接口
      data: {
        Method: options.Method,
        Key: options.Key
      },
      dataType: "json",
      success: function(result) {
        var data = result.data;
        var credentials = data && data.credentials;
        if (!data || !credentials) return console.error("credentials invalid");
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

export default {
  components: { HistoryCard, Uploader },
  data() {
    return {
      // gallery: ["km-1256664426.cos.ap-beijing.myqcloud.com/km/wx38d854d0c185f949.o6zAJs3u9GA6D09AxYC78hOR---s.A9b4nMJb1arAa909d0bd013539a49bc8e8bc4f84effb.png",
      // "km-1256664426.cos.ap-beijing.myqcloud.com/km/wx38d854d0c185f949.o6zAJs3u9GA6D09AxYC78hOR---s.YwsLgY0bqKF54023049ccba0c037bf2dbd4aba5e8766.png",
      // "km-1256664426.cos.ap-beijing.myqcloud.com/km/wx38d854d0c185f949.o6zAJs3u9GA6D09AxYC78hOR---s.Ms345l1dsPlH095c19631a454d442e9c042ab70adbcb.png"].map(url => 'https://' + url),
    };
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
    }),
    ...mapGetters("auth", {
      token: "token",
      user: "user"
    }),
    gallery: function () {
      return (this.user.gallery || []).map(url => 'https://' + url)
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
        }
      });
    },
    async handleSendMessage() {
      await sendTemplateMessage();
    },
    async onFileUploaded(res) {
      const self = this;
      console.log("on File Upload:", res);

      var filePath = res[0];
      var filename = filePath.substr(filePath.lastIndexOf("/") + 1);
      cos.postObject(
        {
          Bucket: Bucket,
          Region: Region,
          Key: "km/" + filename,
          FilePath: filePath,
          onProgress: function(info) {
            console.log("on progress", JSON.stringify(info));
          }
        },
        async function(err, data) {
          console.log("data or err", err || data);
          if (!err && data) {
            const gallery = await addToGallery(data.Location);
            self.gallery = gallery;
            self.setUserGallery(gallery)
            console.log("GALLERY", gallery);
          }
        }
      );
    },
    deleteGallery(filename) {
      const self = this;
      cos.deleteObject(
        {
          Bucket: Bucket /* 必须 */,
          Region: Region /* 存储桶所在地域，必须字段 */,
          Key: filename /* 必须 */
        },
        async function(err, data) {
          console.log(err || data);
          // const filepath = filename.substr(filename.indexOf("/") + 2)
          const gallery = await deleteFromGallery(`${Bucket}.cos.${Region}.myqcloud.com/` + filename);
          self.setUserGallery(gallery)
        }
      );
    },
    onFileDeleted(filePath) {
      console.log('obj', filePath)
      var filename = filePath.substr(filePath.lastIndexOf("/") + 1);
      this.deleteGallery('km/' + filename)
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