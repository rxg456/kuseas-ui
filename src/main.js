import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/main.css' // 导入全局css文件
import axios from 'axios'

// 加载 svg icons
import './icons'

// 请求拦截器
// 全局拦截器，只要发起异步请求都要带上这个token
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('token')
  return config
})
// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 1 < code < 100 要求重新登录
    if (response.data && response.data.code && response.data.code > 1 && response.data.code < 100) {
      router.push('/login')
    } else {
      return response
    }
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

axios.defaults.baseURL = '/api/v1/' // 默认值，默认的url头
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
