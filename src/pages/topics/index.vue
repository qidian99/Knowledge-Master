<template>
  <div class="container is--grid" @click="clickHandle" :style="gridStyle">
    <div class="b-topic is--griditem" v-for="(item,index) in topics" :key="index">
      <TopicCard :topic="item.name" @clicktopic="handleClickTopic"/>
    </div>
  </div>
</template>

<script>
import TopicCard from '@/components/topic-card'
import { topicsQuery } from '../../utils/queries'
import { blue } from '@ant-design/colors'

console.log(blue)

export default {
  components: { TopicCard },
  computed: {
    gridStyle: function () {
      return 'background-color:' + blue[0]
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

    self.topics = topics

    // self.notifyUserInfo(user)
  },
  data () {
    return {
      topics: []
    }
  },
  methods: {
    handleClickTopic (data) {
      console.log('>>>>', data)
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
}
.b-topic.is--griditem {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px dashed rgba(0, 0, 0, 0.8);
  padding: 20px;
  font-size: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 400px; */
}
</style>