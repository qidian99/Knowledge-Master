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
import { mapGetters, mapState, mapMutations } from "vuex";
import { SET_USER_TOPIC } from "../../store/mutation-types";

console.log(blue)

export default {
  components: { TopicCard },
  data () {
    return {
      topics: [{
        name: "test1"
      }, {
        name: "test2"
      }]
    }
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
    ...mapMutations([`topics/${SET_USER_TOPIC}`]),
    handleClickTopic (data) {
      console.log('>>>>', data, `topics/${SET_USER_TOPIC}`)
      this[`topics/${SET_USER_TOPIC}`](data.topic)
      wx.navigateBack(data)
    }
  }
}
</script>

<style scoped>
.container.is--grid {
  display: grid;
  grid-template-columns: auto auto;
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