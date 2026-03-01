import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth-store'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  // withCredentials: true,
})

/** 防止同時間多次 refresh */
const isRefreshing = ref(false)

/** refresh 期間的請求佇列 */
let pendingQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}> = []

function flushQueue(error?: unknown) {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error)
    }
    else {
      resolve(api(config))
    }
  })
  pendingQueue = []
}

/** Request interceptor：自動加入 accessToken */
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.accessToken
  if (token) {
    if (config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
  }
  return config
})

/** Response interceptor：401 refresh、403 直接拋錯 */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const response = error.response
    const originalConfig = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (!response) {
      return Promise.reject(error)
    }

    // 403：權限不足，直接失敗
    if (response.status === 403) {
      return Promise.reject(error)
    }

    // 非 401 不處理
    if (response.status !== 401) {
      return Promise.reject(error)
    }

    // 已 retry 過仍 401，視為登入失效
    if (originalConfig._retry) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    originalConfig._retry = true

    // refresh 進行中，加入佇列等待
    if (isRefreshing.value) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: originalConfig })
      })
    }

    isRefreshing.value = true
    const authStore = useAuthStore()

    try {
      await authStore.refreshToken()
      flushQueue()

      originalConfig.headers = {
        ...originalConfig.headers,
        Authorization: `Bearer ${authStore.accessToken}`,
      }

      return api(originalConfig)
    }
    catch (err) {
      flushQueue(err)
      authStore.logout()
      window.location.href = '/login'
      return Promise.reject(err)
    }
    finally {
      isRefreshing.value = false
    }
  },
)

export default api
