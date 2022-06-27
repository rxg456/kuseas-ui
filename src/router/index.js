import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/user/LoginView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },

  // 404页面
  {
    path: '/404',
    component: () => import('@/views/common/error-page/404')
  },
  // 如果前面所有路径都没有匹配到页面 就跳转到404页面
  { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
