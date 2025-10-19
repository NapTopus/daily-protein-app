<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sign Up</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="p-[16px] max-w-[400px] mx-auto">
        <!-- Sign Up Form Card -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Create Account</ion-card-title>
            <ion-card-subtitle>Join us today!</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">
                Name
              </ion-label>
              <ion-input
                v-model="signUpForm.name"
                type="text"
                placeholder="Enter your name"
                :disabled="isLoading"
              />
            </ion-item>

            <ion-item>
              <ion-label position="stacked">
                Email
              </ion-label>
              <ion-input
                v-model="signUpForm.email"
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
                v-model="signUpForm.password"
                type="password"
                placeholder="Enter your password"
                :disabled="isLoading"
              >
                <ion-input-password-toggle slot="end" />
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">
                Confirm Password
              </ion-label>
              <ion-input
                v-model="signUpForm.password_confirmation"
                type="password"
                placeholder="Confirm your password"
                :disabled="isLoading"
              >
                <ion-input-password-toggle slot="end" />
              </ion-input>
            </ion-item>

            <div class="ion-padding">
              <ion-button
                expand="block"
                type="submit"
                :disabled="isLoading"
                @click="handleSignUp"
              >
                <ion-spinner
                  v-if="isLoading"
                  name="crescent"
                />
                <p v-else>
                  Sign Up
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
                name="warning"
              />
              <ion-label>{{ errorMessage }}</ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <div class="fixed bottom-4 left-0 w-full text-center">
          Already have an account?
          <router-link :to="{ name: RouteName.LOGIN }">
            Log In
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUp } from '@/api/auth'
import { RouteName } from '@/router/index'

const router = useRouter()

const signUpForm = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errorMessage = ref('')

const { execute: handleSignUp, isLoading } = useAsyncState(
  async () => {
    errorMessage.value = ''

    const [err, res] = await to(signUp(
      signUpForm.value,
    ))

    if (err) {
      errorMessage.value = (err as any)?.response?.data?.message || 'Sign up failed'
      throw err
    }

    // TODO: call login API

    // const token = res?.data?.token
    // if (token)
    //   localStorage.setItem('token', token)

    router.replace({ name: RouteName.INDEX })
    return res.data
  },
  null,
  { immediate: false },
)
</script>

<style scoped></style>
