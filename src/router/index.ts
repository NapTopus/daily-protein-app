import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/tabs-page.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/index'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/index'
      },
      {
        path: 'index',
        component: () => import('@/views/the-index.vue')
      },
      {
        path: 'history',
        component: () => import('@/views/the-history.vue')
      },
      {
        path: 'analysis',
        component: () => import('@/views/the-analysis.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/the-settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
