import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/user/LoginView'
import Home from '../views/dashboard/Home'

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
  {
    path: '/home',
    component: Home
    // redirect: '/welcome',
    // children: [
    //   { path: '/welcome', component: Welcome },
    //   { path: '/users', component: Welcome }
    // ]
  },

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

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = window.localStorage.getItem('token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
  next()
})

export default router
