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
            <ion-card-subtitle>Sign in to your account</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">
                Email
              </ion-label>
              <ion-input
                v-model="loginForm.email"
                type="email"
                placeholder="Enter your email"
                :disabled="isLoading"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">
                Password
              </ion-label>
              <ion-input
                v-model="loginForm.password"
                type="password"
                placeholder="Enter your password"
                :disabled="isLoading"
              />
            </ion-item>

            <div class="ion-padding">
              <ion-button
                expand="block"
                :disabled="isLoading || !loginForm.email || !loginForm.password"
                class="my-[8px]"
                @click="handleLogin"
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
              v-if="errorMessage"
              color="danger"
            >
              <ion-icon
                slot="start"
                :icon="warningOutline"
              />
              <ion-label>{{ errorMessage }}</ion-label>
            </ion-item>
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
import { useAsyncState } from '@vueuse/core'
import to from 'await-to-js'
import { warningOutline } from 'ionicons/icons'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { RouteName } from '@/router/index'
import { loginSchema } from '@/schemas'

const router = useRouter()

const loginForm = ref({
  email: '',
  password: '',
})

const errorMessage = ref('')

const { execute: handleLogin, isLoading } = useAsyncState(
  async () => {
    errorMessage.value = ''

    const [err, res] = await to(login(
      loginForm.value,
    ))

    if (err) {
      errorMessage.value = (err as any)?.response?.data?.message || 'Login failed'
      throw err
    }

    const token = res?.data?.token
    if (token)
      localStorage.setItem('token', token)

    router.replace({ name: RouteName.INDEX })
    return res.data
  },
  null,
  { immediate: false },
)
</script>

<style scoped></style>
