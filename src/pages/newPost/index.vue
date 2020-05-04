<template>
  <div class="page">
    <div class="weui-cells__title">标题</div>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <input
            :value="title"
            @input="handleTitleInput"
            class="weui-input"
            maxlength="30"
            placeholder="请输入标题"
          />
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
          <div
            class="weui-textarea-counter"
            :class="{textErr: bodyError}"
          >{{bodyTextLength + '/' + BODY_LIMIT}}</div>
        </div>
      </div>
    </div>
    <div class="b-posts-images">
      <PostImages @upLoadSuccess="onFileUploaded" @uploadDelete="onFileDeleted" />
    </div>
    <div class="err-message" v-if="showErr">{{errMsg}}</div>
    <div class="weui-btn-area">
      <button
        class="weui-btn"
        :style="submitStyle"
        type="primary"
        @click="submitPost"
        :disabled="bodyError"
      >确定</button>
    </div>
  </div>
</template>

<script>
import TopicCard from "@/components/topic-card";
import PostImages from "@/components/post-images";
import { createPostMutation } from "../../utils/queries";
import { createPost } from "../../utils/post";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";
import { cos, Bucket, Region } from "../../utils/cos";

const BODY_LIMIT = 200;
export default {
  components: { TopicCard, PostImages },
  data() {
    return {
      showErr: false,
      title: "",
      body: "",
      BODY_LIMIT,
      files: []
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
    submitStyle: function() {
      return "background-color:" + blue.primary;
    },
    bodyTextLength: function() {
      return this.body.length;
    },
    bodyError: function() {
      return (
        this.body.length > BODY_LIMIT ||
        this.body.length === 0 ||
        this.title.length === 0
      );
    },
    errMsg: function() {
      let msg = "";
      if (this.title.length === 0) {
        msg += "请输入标题";
        if (this.body.length === 0) {
          msg += "和内容";
        }
      } else if (this.body.length === 0) {
        msg = "请输入内容";
      } else {
        msg = "服务器无响应";
      }
      return msg;
    }
  },
  methods: {
    ...mapActions("topics", {
      setUserTopic: "setUserTopic"
    }),
    ...mapActions("posts", {
      setPosts: "setPosts"
    }),
    handleBodyInput: function(e) {
      this.showErr = false;
      const {
        mp: {
          detail: { value }
        }
      } = e;
      this.body = value;
    },
    handleTitleInput: function(e) {
      this.showErr = false;
      const {
        mp: {
          detail: { value }
        }
      } = e;
      this.title = value;
    },
    submitPost: async function() {
      try {
        const self = this;
        if (this.files.length > 0) {
          // await for upload to cos
          
          const fileArray = new Array(this.files.length);

          let finished = 0;
          console.log("Init file arry", fileArray);

          wx.showLoading({
            title: "加载中" // loading
          });

          await Promise.all(
            this.files.map(async (file, index) => {
              var filename = file.substr(file.lastIndexOf("/") + 1);
              cos.postObject(
                {
                  Bucket: Bucket,
                  Region: Region,
                  Key: "km/" + filename,
                  FilePath: file,
                  onProgress: function(info) {
                    console.log("on progress", JSON.stringify(info));
                  }
                },
                async function(err, data) {
                  console.log("data or err", err || data);
                  if (!err && data) {
                    fileArray[index] = data.Location;
                    console.log(
                      "Upload finish of file at index",
                      index,
                      "to location",
                      data.Location
                    );
                    finished += 1;
                    if (finished === fileArray.length) {
                      console.log("Finish uploading file arry", fileArray);
                      const post = await createPost(
                        self.topic.topicId,
                        self.title,
                        self.body,
                        fileArray
                      );
                      console.log(post);
                      self.setPosts([post, ...self.posts]);

                      self.body = "";
                      self.title = "";

                      wx.navigateBack();
                    }
                  }
                }
              );
            })
          );
        } else {
           const post = await createPost(
            self.topic.topicId,
            self.title,
            self.body,
            []
          );
          console.log(post);
          self.setPosts([post, ...self.posts]);

          self.body = "";
          self.title = "";

          wx.navigateBack();
        }
      } catch (err) {
        self.showErr = true;
        console.log(err);
      }
    },
    onFileDeleted(deleteRes) {
      this.files = deleteRes.files;
      console.log(this.files);
    },
    async onFileUploaded(res) {
      this.files = res;
      console.log(this.files);
    }
  }
};
</script>

<style scoped>
.weui-cells__title {
  padding-bottom: 4px;
}

.err-message {
  padding: 20px 0px 0px 15px;
  color: red;
}

.weui-btn-area {
  display: block;
}

.b-posts-images {
  display: block;
  /* border: 10px solid black; */
  height: auto;
}
</style>