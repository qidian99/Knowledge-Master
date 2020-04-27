<template>
  <div class="b-topic-card" @click="handleClick">
    {{topic}}
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
console.log("grey", presetPrimaryColors);
export default {
  props: {
    topic: {
      type: String,
      default: 'N/A'
    },
  },
  computed: {
  },
  data() {},
  methods: {
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
  /* border-radius: 5px;
  background-color: white; */
}
</style>
