<template>
  <div class="setting-option-container" :style="containerStyle">
    <div class="setting-option-title">{{title}}</div>
    <div class="setting-option-value" v-if="src" >
      <img class="setting-option-avatar" :src="src" />
    </div>
    <div class="setting-option-value w--text" v-if="text" >
      {{ text }}
    </div>
    <div v-if="navigation">
      <!-- <a-icon type="right" /> -->
    </div>
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";

console.log("grey", presetPrimaryColors);
export default {
  props: {
    src: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: null
    },
    navigation: {
      type: String,
      default: null
    },
  },
  computed: {
    containerStyle() {
      if (!this.src) {
        return 'padding: 15px 20px'
      }
      // return 'background-color: ' + grey.primary;
    }
  },
  data() {},
  methods: {}
};
</script>

<style scoped>
.setting-option-container {
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  /* height: 50px; */
  border-radius: 5px;
  background-color: white;
}

.setting-option-container {
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  /* height: 50px; */
  border-radius: 5px;
  background-color: white;
}

.setting-option-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  color: rgba(0, 0, 0, 0.85);
}

.setting-option-value {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 2;
  color: rgba(0, 0, 0, 0.65);
}

.setting-option-value.w--text {
  padding-right: 5px;
}

.setting-option-avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
</style>
