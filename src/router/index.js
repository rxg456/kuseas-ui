import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/LoginView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  }
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
]

const router = new VueRouter({
  routes
})

export default router