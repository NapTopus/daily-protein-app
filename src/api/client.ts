// src/api/client.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://daily-protein.lynkishere.com/api',
  timeout: 10000,
})

// 自動加上 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token)
    config.headers.Authorization = `Bearer ${token}`
  return config
})

// Token 過期時導回登入
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
