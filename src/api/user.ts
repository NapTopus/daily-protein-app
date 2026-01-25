import api from './client'

/** 取得用戶資訊 */
export function getUserInfo() {
  return api.get('users/me')
}

/** 更新用戶資訊 */
export function updateUserInfo(payload: { target: number }) {
  return api.patch('users/me', payload)
}
