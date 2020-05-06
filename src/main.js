import Vue from 'vue'

import 'mpvue-weui/src/style/weui.css'
import App from './App'
import WXrequest from './utils/request'
import store from './store'

Vue.config.productionTip = false


Vue.prototype.$http = WXrequest
Vue.prototype.$store = store
// Vue.loadScript('/js/cos-js-sdk-v5.min.js') // no loader

// 测试过 不太可用
// Vue.use(icons)
// Vue.component(Filter.name, Filter);
// Vue.use(Button);
// Vue.prototype.$message = message;
// Vue.use(Antd)
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
// import { Button, message } from 'ant-design-vue';
// import { Button, message } from 'ant-design-vue/lib';
// import '~antd/es/style/color/colors.less'
// import icons from '@ant-design/icons-vue';



// 接着，这个App.vue组件被src/main.js引入并被设置了一个mpType的属性值，其值为app。
//  这个值是为了与后面要讲的小程序页面组件所区分开来，因为小程序页面组件和这个App.vue组件的写法和引入方式是一致的，
//  为了区分两者，需要设置mpType值。引入这个App.vue组件后，会用它作为参数来创建一个Vue的实例，并调用$mount()方法加载
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

// app.json是小程序的全局配置文件
export default {
  config: {
    pages: [
      '^pages/index/main',
      '^pages/setting/main',
      '^pages/topics/main',
      '^pages/newPost/main',
      '^pages/editPost/main',
      '^pages/post/main',
      '^pages/username/main',
      '^pages/history/main',
      '^pages/dev/main',
      '^pages/user/main',
      '^pages/myposts/main',
      "^pages/gallery/main",
      "^pages/chat/main"
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'Knowledge Master',
      navigationBarTextStyle: 'black'
    }
  }
}
