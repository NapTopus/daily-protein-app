import to from 'await-to-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, updateUserInfo } from '@/api/user'

export interface UserInfo {
  defaultTarget?: number
  [key: string]: unknown
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const isLoading = ref(false)

  /** 取得用戶資訊（有快取則不重複 fetch） */
  async function fetchUserInfo() {
    if (userInfo.value) return
    isLoading.value = true
    const [err, res] = await to(getUserInfo())
    isLoading.value = false
    if (err) {
      console.error('取得用戶資訊失敗：', err)
      return
    }
    userInfo.value = res.data
  }

  /** 更新目標蛋白質，成功後同步更新 store */
  async function updateTarget(target: number) {
    const [err] = await to(updateUserInfo({ target }))
    if (err) throw err
    if (userInfo.value) {
      userInfo.value.defaultTarget = target
    }
  }

  return { userInfo, isLoading, fetchUserInfo, updateTarget }
})
