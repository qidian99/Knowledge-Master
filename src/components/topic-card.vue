<template>
  <div @touchstart="hover = true" @touchend="hover = false" class="b-topic-card" :class="{ active: hover }" @click="handleClick">
    {{topic.name}}
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
  },
  computed: {
  },
  data() {
    return {
      hover: false,
    };
  },
  methods: {
    mouseDowning: function () {
      console.log("Mouse moving");
      this.hover = true;
    },
    handleClick: function () {
      this.notifiyTopic()
    },
    notifiyTopic () {
      this.$emit('clicktopic', {
        topic: this.topic
      })
    }
  }
};
</script>

<style scoped>
.b-topic-card{
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 15);
  padding: 20px;
  font-size: 28px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.8), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  border-radius: 5px;
  margin: 10px;
}

.b-topic-card.active {
  background-color: rgba(0, 0, 0, 0.25);
}
</style>
