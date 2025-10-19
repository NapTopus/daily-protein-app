import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import TabsPage from '../views/tabs-page.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
  }
}

export enum RouteName {
  /** 登入 */
  LOGIN = 'login',
  /** 註冊 */
  SIGN_UP = 'sign-up',
  /** 首頁 */
  INDEX = 'index',
  /** 歷史紀錄 */
  HISTORY = 'history',
  /** 成效分析 */
  ANALYSIS = 'analysis',
  /** 設定 */
  SETTINGS = 'settings',
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/login',
    name: RouteName.LOGIN,
    component: () => import('@/views/the-login.vue'),
    meta: { title: '登入' },
  },

  {
    path: '/signup',
    name: RouteName.SIGN_UP,
    component: () => import('@/views/sign-up.vue'),
    meta: { title: '註冊' },
  },

  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/index',
      },
      {
        path: 'index',
        name: RouteName.INDEX,
        component: () => import('@/views/the-index.vue'),
        meta: { title: '首頁' },
      },
      {
        path: 'history',
        name: RouteName.HISTORY,
        component: () => import('@/views/the-history.vue'),
        meta: { title: '歷史紀錄' },
      },
      {
        path: 'analysis',
        name: RouteName.ANALYSIS,
        component: () => import('@/views/the-analysis.vue'),
        meta: { title: '成效分析' },
      },
      {
        path: 'settings',
        name: RouteName.SETTINGS,
        component: () => import('@/views/the-settings.vue'),
        meta: { title: '設定' },
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
