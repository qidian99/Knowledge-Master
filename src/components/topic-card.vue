<template>
  <div
    @touchstart="hover = true"
    @touchend="hover = false"
    class="b-topic-card"
    :class="{ active: hover }"
    @click="handleClick"
  >
    <!-- <div class="topic-image">
      <img
        style="width: 65rpx;height: 65rpx;"
        :src="getImgSrc"
        class="card-img"
      />
    </div> -->

    <div>{{topic.name}}</div>
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
console.log("grey", presetPrimaryColors);
export default {
  props: {
    topic: {
      type: Object,
      default: null
    },
    id: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getImgSrc() {
      const PREFIX = "/static/images/star-fill ("
      const SUFFIX = ").svg"
      return PREFIX + (parseInt(this.id) % 6) + SUFFIX;
    }
  },
  data() {
    return {
      hover: false
    };
  },
  methods: {
    mouseDowning: function() {
      // console.log("Mouse moving");
      this.hover = true;
    },
    handleClick: function() {
      this.notifiyTopic();
    },
    notifiyTopic() {
      this.$emit("clicktopic", {
        topic: this.topic
      });
    }
  }
};
</script>

<style scoped>
.b-topic-card {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: start;
  /* background-color: rgba(255, 255, 255, 0.8); */
  border-style: inset;
  border: 1px;
  padding: 20px 20px 20px 20px;
  font-size: 28px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  text-align: center;
  /* border-radius: 5px; */
  margin: 10px;
  /* background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(234,245,255,1) 72%, rgba(149,187,255,1) 100%); */
  background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(247,251,255,1) 74%, rgba(189,213,255,1) 100%);
}

.b-topic-card.active {
  /* background-color: rgba(0, 0, 0, 0.15); */
  opacity: 0.7;
}

.topic-image {
  margin-right: 20px;
  margin-top: 8px;
}
</style>
