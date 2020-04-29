<template>
  <div class="container is--grid" @click="clickHandle" :style="gridStyle">
    <div class="b-topic is--griditem" v-for="(item,index) in topics" :key="index">
      <TopicCard :id="item.topicId" :topic="item" @clicktopic="handleClickTopic"/>
    </div>
  </div>
</template>

<script>
import TopicCard from '@/components/topic-card'
import { topicsQuery } from '../../utils/queries'
import { blue } from '@ant-design/colors'
import { mapGetters, mapState, mapMutations } from "vuex"
import { SET_USER_TOPIC, SET_USER_POST } from "../../store/mutation-types"
import { fetchPosts } from '../../utils/post'
import { subscribeToTopic } from '../../utils/user'
import {
  postsQueryWithTopic
} from "../../utils/queries";

export default {
  components: { TopicCard },
  data () {
    return {
      topics: []
    }
  },
  onLoad(){
    wx.setNavigationBarTitle({
      title:'选择话题',
    })
  },
  async mounted() {
    self = this
    console.log('Topics Mounted')
    const payload = {
      query: topicsQuery,
    }
    const r = await self.$http.post({
      payload
    })
    
    const {
      data: {
        topics
      }
    } = r

    console.log('Topics Fetched:', topics)

    // self.topics = [...this.topics, ...topics] // for testing
    self.topics = topics;

    // self.notifyUserInfo(user)
  },
  computed: {
    gridStyle: function () {
      // return 'background-color:' + blue[0]
    },
    ...mapState({
      topic: state => state.topics.topic
    }),
    ...mapGetters("topics", {
      topic: "topic"
    }),
  },
  methods: {
    ...mapMutations([`topics/${SET_USER_TOPIC}`, `posts/${SET_USER_POST}`]),
    async handleClickTopic (data) {
      const self = this
      console.log('>>>>', data, `topics/${SET_USER_TOPIC}`)
      self[`topics/${SET_USER_TOPIC}`](data.topic)
      const posts = await fetchPosts(postsQueryWithTopic, data.topic.topicId)
      await subscribeToTopic(data.topic.topicId)
      self[`posts/${SET_USER_POST}`](posts)
      wx.navigateBack(data)
    }
  }
}
</script>

<style scoped>
.container.is--grid {
  display: grid;
  grid-template-columns: auto;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.04);
}
.b-topic.is--griditem {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 400px; */
}
</style>