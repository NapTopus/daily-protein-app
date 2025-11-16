<template>
  <form @submit="onSubmit">
    <input
      v-model="email"
      name="email"
      type="email"
    >
    <span>{{ errors.email }}</span>
    <input
      v-model="password"
      name="password"
      type="password"
    >
    <span>{{ errors.password }}</span>
    <button>Submit</button>
  </form>
</template>

<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import * as zod from 'zod'

const validationSchema = toTypedSchema(
  zod.object({
    email: zod.string().min(1, { message: 'This is required' }).email({ message: 'Must be a valid email' }),
    password: zod.string().min(1, { message: 'This is required' }).min(8, { message: 'Too short' }),
  }),
)
const { handleSubmit, errors } = useForm({
  validationSchema,
})
const { value: email } = useField('email')
const { value: password } = useField('password')
const onSubmit = handleSubmit((values) => {
  console.log('values', values)
})
</script>
