import to from 'await-to-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { refresh } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')

  function setAccessToken(token: string) {
    accessToken.value = token
  }

  function logout() {
    accessToken.value = ''
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
  }

  return {
    accessToken: computed(() => accessToken.value),
    setAccessToken,
    refreshToken,
    logout,
  }
})
