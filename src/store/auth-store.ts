import to from 'await-to-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { refresh } from '@/api/auth'
import { useUserStore } from '@/store/user-store'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')

  function setAccessToken(token: string) {
    accessToken.value = token
  }

  async function refreshToken() {
    const [err, res] = await to(refresh())
    if (err) {
      return Promise.reject(err) // Allow caller to handle the error
    }
    if (!res.data || !res.data.authToken) {
      return Promise.reject(new Error('Auth token is missing in the response'))
    }
    setAccessToken(res.data.authToken)

    // Fetch user info only if not already loaded
    const userStore = useUserStore()
    if (!userStore.userInfo) {
      await userStore.fetchUserInfo()
    }
  }

  function logout() {
    accessToken.value = ''
    const userStore = useUserStore()
    userStore.reset()
  }

  return {
    accessToken,
    setAccessToken,
    refreshToken,
    logout,
  }
})
