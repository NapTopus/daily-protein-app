import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email 格式不正確'),
  password: z.string().min(6, '密碼至少 6 碼'),
})
