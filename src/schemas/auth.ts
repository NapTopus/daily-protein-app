import { z } from 'zod'

export const loginDtoSchema = z.object({
  email: z.string()
    .min(1, { message: 'This is required' })
    .email({ message: 'Must be a valid email' }),

  password: z.string()
    .min(1, { message: 'This is required' })
    .min(8, { message: 'Too short' })
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/i, {
      message: 'Password must contain at least one letter and one number',
    }),
})

export type LoginDto = z.infer<typeof loginDtoSchema>

export const signUpDtoSchema = z.object({
  name: z.string()
    .min(1, { message: 'This is required' }),

  email: z.string()
    .min(1, { message: 'This is required' })
    .email({ message: 'Must be a valid email' }),

  password: z.string()
    .min(1, { message: 'This is required' })
    .min(8, { message: 'Too short' })
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/i, {
      message: 'Password must contain at least one letter and one number',
    }),

  passwordConfirmation: z.string()
    .min(1, { message: 'This is required' }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords don\'t match',
  path: ['passwordConfirmation'],
})
export type SignUpDto = z.infer<typeof signUpDtoSchema>
