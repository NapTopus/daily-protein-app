<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Log In</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="p-[16px] max-w-[400px] mx-auto">
        <!-- Login Form -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Welcome Back</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <!-- ✅ VeeValidate Form -->
            <form @submit="onSubmit">
              <!-- Email -->
              <ion-item>
                <ion-label position="stacked">
                  Email
                </ion-label>
                <ion-input
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  :disabled="isLoading"
                  @ion-blur="() => { emailBlur(); validateEmail(); }"
                />
              </ion-item>
              <p
                v-if="errors.email"
                class="text-red-500 text-sm mt-1"
              >
                {{ errors.email }}
              </p>

              <!-- Password -->
              <ion-item>
                <ion-label position="stacked">
                  Password
                </ion-label>
                <ion-input
                  v-model="password"
                  type="password"
                  placeholder="Enter your password"
                  :disabled="isLoading"
                  @ion-blur="() => { passwordBlur(); validatePassword(); }"
                >
                  <ion-input-password-toggle slot="end" />
                </ion-input>
              </ion-item>
              <p
                v-if="errors.password"
                class="text-red-500 text-sm mt-1"
              >
                {{ errors.password }}
              </p>

              <div class="ion-padding">
                <ion-button
                  expand="block"
                  type="submit"
                  :disabled="isLoading"
                >
                  <ion-spinner
                    v-if="isLoading"
                    name="crescent"
                  />
                  <p v-else>
                    Sign In
                  </p>
                </ion-button>
              </div>

              <!-- Error Display -->
              <ion-item
                v-if="loginErrorMessage"
                color="danger"
              >
                <ion-icon
                  slot="start"
                  :icon="warningOutline"
                />
                <ion-label>{{ loginErrorMessage }}</ion-label>
              </ion-item>
            </form>
          </ion-card-content>
        </ion-card>

        <div class="fixed bottom-4 left-0 w-full text-center">
          Don’t have an account?
          <router-link :to="{ name: `${RouteName.SIGN_UP}` }">
            Sign Up
          </router-link>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import type { LoginDto } from '@/schemas'
import { toTypedSchema } from '@vee-validate/zod'
import to from 'await-to-js'
import { warningOutline } from 'ionicons/icons'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { RouteName } from '@/router'
import { loginDtoSchema } from '@/schemas'
import { useAuthStore } from '@/store/auth-store'

// 將 Zod schema 轉為 VeeValidate 格式
const loginSchema = toTypedSchema(loginDtoSchema)

const router = useRouter()
const { setAccessToken } = useAuthStore()
const loginErrorMessage = ref('')
const isLoading = ref(false)

const { handleSubmit, errors } = useForm({
  validationSchema: loginSchema,
})

const { value: email, handleBlur: emailBlur, validate: validateEmail } = useField('email', undefined, {
  validateOnValueUpdate: false,
})

const { value: password, handleBlur: passwordBlur, validate: validatePassword } = useField('password', undefined, {
  validateOnValueUpdate: false,
})

const onSubmit = handleSubmit(async (values: LoginDto) => {
  loginErrorMessage.value = ''
  isLoading.value = true

  const [err, res] = await to(login(values))

  if (err) {
    loginErrorMessage.value = (err as any)?.response?.data?.message || 'Login failed'
    isLoading.value = false
    return
  }

  const token = res?.data?.authToken

  if (token)
    setAccessToken(token)

  router.replace({ name: RouteName.INDEX })
  isLoading.value = false
})
</script>

<style scoped>
ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}
</style>
