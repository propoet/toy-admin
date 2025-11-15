import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layouts/Layout.vue'
import { useTagsViewStore } from '@/store/tagsView'
import About from '@/views/About.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Settings from '@/views/Settings.vue'

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
          affix: true, // 首页设置为固定标签
        },
      },
      {
        path: 'about',
        name: 'About',
        component: About,
        meta: {
          title: '关于',
          KeepAlive: true, // 启用缓存
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: {
          title: '设置',
          KeepAlive: false, // 不启用缓存，用于对比测试
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

// 标记是否已初始化固定标签
let isAffixTagsInitialized = false

// 路由守卫：自动添加标签到 TagsView
router.beforeEach((to, from, next) => {
  // 获取 tagsView store
  const tagsViewStore = useTagsViewStore()

  // 首次加载时，初始化固定标签
  if (!isAffixTagsInitialized) {
    // 从路由配置中提取固定标签
    const affixRoutes = routes
      .flatMap(route => (route.children || []))
      .filter(route => route.meta?.affix)
      .map(route => ({
        path: route.path === '' ? '/' : `/${route.path}`,
        name: route.name as string,
        title: (route.meta?.title as string) || route.name as string,
        meta: route.meta,
        affix: true,
      }))

    if (affixRoutes.length > 0) {
      tagsViewStore.initAffixTags(affixRoutes)
    }

    isAffixTagsInitialized = true
  }

  // 排除不需要添加到 tagsView 的路由
  // 例如：登录页、404 页面等
  const excludeRoutes = ['/login']
  const isExcludeRoute = excludeRoutes.includes(to.path)

  // 如果路由有 name 且不在排除列表中，添加到 tagsView
  if (to.name && !isExcludeRoute) {
    tagsViewStore.addView(to)
  }

  next()
})

export default router
