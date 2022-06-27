import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/main.css' // 导入全局css文件
import axios from 'axios'

// 加载 svg icons
import './icons'

axios.defaults.baseURL = '/api/v1/' // 默认值，默认的url头
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')