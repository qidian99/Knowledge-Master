<template>
  <div class="weui-uploader">
    <div class="b-uploader-header" v-if="showTip">
      <div class="uploader-header">{{title}}</div>
      <div class="uploader-header is--count">{{files.length}}/{{maxLength}}</div>
    </div>
    <div class="b-uploader-file-wrapper">
      <div class="uploader-files" id="uploaderFiles">
        <div v-for="(item ,index) in files" :key="index">
          <div class="weui-uploader__file">
            <image
              class="weui-uploader__img"
              :src="item"
              mode="aspectFill"
              @click="predivImage"
              :id="item"
              :style="imgStyle"
            />
            <div class="delete-icon" v-if="showDelete" @click="deleteImg" :id="item" :data-index="index" :key="index"></div>
          </div>
        </div>
      </div>
      <div
        class="weui-uploader__input-box"
        v-if="showAdd && (!isMaxHiddenChoose || (files.length < maxLength))"
      >
        <div class="weui-uploader__input" @click="chooseImage"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    console.log("Showing post images:", this.initialFileList)
  },
  data() {
    return {
      files: this.initialFileList.slice(0, this.maxLength)
    };
  },
  props: {
    title: {
      type: String,
      default: '选择图片'
    },
    maxLength: {
      type: Number,
      default: 9
    },
    showTip: {
      type: Boolean,
      default: true
    },
    count: {
      type: Number,
      default: 9
    },
    isMaxHiddenChoose: {
      type: Boolean,
      default: true
    },
    initialFileList: {
      type: Array,
      default: () => []
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    thumbnailStyle: {
      type: Object,
      default: null
    }
  },
  computed: {
    imgStyle: function () {
      // console.log('computing thumbnail style', this.thumbnailStyle)
      if (this.thumbnailStyle) {
        const {
          width,
          height
        } = this.thumbnailStyle
        return "width:" + width + ";" + "height:" + height + ";"
      }
      return ""
    }
  },
  methods: {
    chooseImage(e) {
      let _this = this;
      if (!(this.files.length > this.maxLength - 1)) {
        wx.chooseImage({
          count: _this.maxLength - _this.count, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            _this.files = _this.files.concat(res.tempFilePaths);
            res.files = _this.files;
            _this.$emit('upLoadSuccess', res);
            // _this.$emit('upLoadSuccess', res.tempFilePaths);
          },
          fail: function (res) {
            _this.$emit('upLoadFail', res);
            // 修改提交记录
          },
          complete: function (res) {
            _this.$emit('upLoadComplete', res);
          }
        });
      } else {
        wx.showToast({
          title: `最多上传 ${this.maxLength} 张图片`,
          icon: 'none',
          mask: true
        });
      }
    },
    predivImage(e) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.files // 需要预览的图片http链接列表
      });
    },
    deleteImg(e) {
      Array.prototype.indexOf = function (val) { // eslint-disable-line
        for (let i = 0; i < this.length; i++) {
          if (this[i] === val) return i;
        }
        return -1;
      };
      Array.prototype.remove = function (val) { // eslint-disable-line
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      // console.log(e)
      // console.log(e.currentTarget)
      // console.log('deleting', this.files)
      this.files.remove(e.currentTarget.id);
      let uploadDeleteObj = {
        src: e.currentTarget.id,
        index: e.currentTarget.dataset.index,
        files: this.files
      };
      this.$emit('uploadDelete', uploadDeleteObj);
    },
    clearFiles() {
      this.files = [];
    },
    setFiles(files) {
      this.files = files;
    }
  }
};
</script>

<style scoped>
.weui-uploader__file {
  position: relative;
  margin-right: 4vw;
  margin-bottom: 4vw;

}
.weui-uploader__img {
  display: block;
  width: 26vw;
  height: 26vw;
  /* margin-right: 5vw; */
}


.weui-uploader__input-box {
  width: 26vw;
  height: 26vw;
}

.weui-uploader__bd {
  overflow: visible;
  margin-top: 0.77em;
  margin-bottom: 0.3em;
  padding-left: 15px;
  padding-right: 15px;
}

.delete-icon {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  background: #f43530;
  right: -15rpx;
  top: -20rpx;
  border-radius: 40rpx;
  z-index: 5;
}
.delete-icon::before {
  content: "";
  width: 26rpx;
  height: 4rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}

.b-uploader-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.uploader-header {
  place-self: center left;
  margin-top: 0.77em;
  margin-bottom: -0.3em;
  padding-left: 15px;
  padding-right: 15px;
  color: #999;
  font-size: 14px;
}

.uploader-header.is--count {
  place-self: center right;
}

.b-uploader-file-wrapper {
  margin-top: 0.77em;
  margin-bottom: 0.3em;
  padding-left: 15px;
  /* padding-right: 25px; */
  overflow: hidden;
}

.uploader-files {
  padding-top: 0.8em;
  overflow: visible;
}
</style>