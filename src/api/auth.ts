// src/api/auth.ts
import api from './client'

/** 用戶註冊 */
export function signUp(payload: { name: string; email: string; password: string; password_confirmation: string }) {
  return api.post('/register', payload)
}

/** 用戶登入 */
export function login(payload: { email: string; password: string }) {
  return api.post('/login', payload)
}
