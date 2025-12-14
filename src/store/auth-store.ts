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
      logout()
      window.location.href = '/login'
      return
    }
    setAccessToken(res.data.accessToken)
  }

  return {
    accessToken: computed(() => accessToken.value),
    setAccessToken,
    refreshToken,
    logout,
  }
})
