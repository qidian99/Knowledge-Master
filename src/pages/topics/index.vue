<template>
  <div class="container is--grid" @click="clickHandle" :style="gridStyle">
    <div class="b-topic is--griditem" v-for="(item,index) in topics" :key="index">
      <TopicCard :id="index" :topic="item" @clicktopic="handleClickTopic" />
    </div>
  </div>
</template>

<script>
import TopicCard from "@/components/topic-card";
import { topicsQuery } from "../../utils/queries";
import { blue } from "@ant-design/colors";
import { mapGetters, mapState, mapActions } from "vuex";
import { SET_USER_TOPIC, SET_USER_POST } from "../../store/mutation-types";
import { fetchPosts } from "../../utils/post";
import { subscribeToTopic } from "../../utils/user";
import { postsQueryWithTopic } from "../../utils/queries";

export default {
  components: { TopicCard },
  data() {
    return {
      topics: []
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "选择话题"
    });
  },
  async mounted() {
    self = this;
    console.log("Topics Mounted");
    const payload = {
      query: topicsQuery
    };
    const r = await self.$http.post({
      payload
    });

    const {
      data: { topics }
    } = r;

    console.log("Topics Fetched:", topics);

    // self.topics = [...this.topics, ...topics] // for testing
    self.topics = topics;

    // self.notifyUserInfo(user)
  },
  computed: {
    gridStyle: function() {
      // return 'background-color:' + blue[0]
    },
    ...mapState({
      topic: state => state.topics.topic
    }),
    ...mapGetters("topics", {
      topic: "topic"
    })
  },
  methods: {
    ...mapActions("topics", {
      setUserTopic: "setUserTopic"
    }),
    ...mapActions("posts", {
      setPosts: "setPosts"
    }),
    async handleClickTopic(data) {
      const self = this;
      console.log(">>>>", data, `topics/${SET_USER_TOPIC}`);
      self.setUserTopic(data.topic);
      const posts = await fetchPosts(postsQueryWithTopic, data.topic.topicId);
      await subscribeToTopic(data.topic.topicId);
      self.setPosts(posts);
      wx.navigateBack(data);
      wx.switchTab({
        url: "/pages/index/main"
      });
    }
  }
};
</script>

<style scoped>
.container.is--grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10px;
  /* background-color: rgba(0, 0, 0, 0.04); */
  background-color: transparent;
}
.b-topic.is--griditem {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 400px; */
}
</style>

<style>
page {
  background: rgba(0, 0, 0, 0.08);
}
</style>