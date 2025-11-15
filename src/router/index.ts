import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layouts/Layout.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
          KeepAlive: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' },
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
