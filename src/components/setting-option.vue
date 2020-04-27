<template>
   <div class="setting-container" :style="containerStyle" >
     <div class="setting-title">{{title}}</div>
     <div class="setting-value">
      <img class="setting-avatar" :src="src" >
    </div>
  </div>
</template>

<script>
import { blue } from '@ant-design/colors';
console.log('blue.primary', blue.primary)
export default {
  props: {
    src: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    containerStyle () {
      return 'background-color: ' + blue.primary;
    }
  },
  data() {
  },
  methods: {
  }
}
</script>

<style>
.setting-container {
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  height: auto;
  /* background-color: {{blue}}; */
}
.setting-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
}

.setting-value {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 2;
}

.setting-avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
</style>
