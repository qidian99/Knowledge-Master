<template>
  <div class="b-option-sheet" v-on:click.stop="() => {}">
    <div v-on:click.stop="handleEditOption" class="option">
      <img class="option-icon" src="/static/icons/edit-option.svg" />
      <div class="option-text">编辑帖子</div>
    </div>
    <div class="option-divisor" />
    <div v-on:click.stop="handleDeleteOption" class="option">
      <img class="option-icon" src="/static/icons/delete.svg" />
      <div class="option-text">删除帖子</div>
    </div>
    <div class="option-divisor" />
    <div v-on:click.stop="handleShareOption" class="option">
      <img class="option-icon" src="/static/icons/share.svg" />
      <div class="option-text">分享贴子</div>
    </div>
  </div>
</template>

<script>
import { presetPrimaryColors, grey } from "@ant-design/colors";
export default {
  props: {
    optionPost: {
      type: Object,
      default: null
    },
    id: {
      type: Number,
      default: 0
    }
  },
  computed: {
    post: function() {
      return this.optionPost;
    }
  },
  created: function() {
    console.log("Action sheet created with parameters", this.props);
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
      this.notifyOption();
    },
    notifyOption() {
      this.$emit("clickoption", {
        topic: this.topic
      });
    },
    handleDeleteOption(e) {
      this.$emit("optiondelete", this.post);
    },
    handleEditOption(e) {
      this.$emit("optionedit", this.post);
    },
    handleShareOption(e) {
      this.$emit("optionshare", this.post);
    }
  }
};
</script>

<style scoped>
.b-option-sheet {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: auto;
  border-top: 1px solid #ececec;
  border-radius: 10px 10px 0px 0px;
  background-color: white;
}

.topic-image {
  margin-right: 20px;
  margin-top: 8px;
}

.option {
  /* border: 10px solid black; */
  padding: 10px 15px 10px 15px;
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}

.option-divisor {
  grid-area: div;
  width: 100%;
  margin: 0px 0px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.option-icon {
  width: 32px;
  height: 32px;
  margin-right: 15px;
}

.option-text {
  /* flex: 1; */
  /* border: 1px solid black */
}
</style>
