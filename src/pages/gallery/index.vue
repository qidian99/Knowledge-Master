<template>
  <div class="container">
    <div class="uploader">
      <Uploader
        @upLoadSuccess="onFileUploaded"
        @uploadDelete="onFileDeleted"
        :initialFileList="gallery"
        :isMaxHiddenChoose="true"
        title="选择要展示的图片"
      />
    </div>
    <div class="weui-btn-area">
      <button class="weui-btn" style="background-color:#1890ff" type="primary" @click="doneSettingGallery">返回</button>
    </div>
  </div>
</template>


<script>
import HistoryCard from "@/components/history-card";
import Uploader from "@/components/uploader";
import { createPostMutation } from "../../utils/queries";
import { sendTemplateMessage } from "../../client/post";
import {
  addToGallery,
  deleteFromGallery,
  deleteGallery
} from "../../client/gallery";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";
import {
    cos,
    Bucket,
    Region
} from '../../utils/cos'


export default {
  components: { HistoryCard, Uploader },
  onLoad(query) {
    wx.setNavigationBarTitle({
      title: "我的画廊"
    });
  },
  async mounted() {},
  computed: {
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
            // console.log("on progress", JSON.stringify(info));
          }
        },
        async function(err, data) {
          console.log("data or err", err || data);
          if (!err && data) {
            const gallery = await addToGallery(data.Location);
            self.gallery = gallery;
            self.setUserGallery(gallery);
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
          const gallery = await deleteFromGallery(
            `${Bucket}.cos.${Region}.myqcloud.com/` + filename
          );
          self.setUserGallery(gallery);
        }
      );
    },
    onFileDeleted(filePath) {
      console.log("obj", filePath);
      var filename = filePath.substr(filePath.lastIndexOf("/") + 1);
      this.deleteGallery("km/" + filename);
    },
    doneSettingGallery() {
      wx.navigateBack()
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
  padding: 15px;
  /* border: 10px solid black; */
}
</style>