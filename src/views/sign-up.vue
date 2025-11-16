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
            <!-- ✅ VeeValidate Form -->
            <form @submit="onSubmit">
              <!-- Name -->
              <ion-item>
                <ion-label position="stacked">
                  Name
                </ion-label>
                <ion-input
                  v-model="name"
                  type="text"
                  placeholder="Enter your name"
                  :disabled="isLoading"
                />
              </ion-item>
              <p
                v-if="errors.name"
                class="text-red-500 text-sm mt-1"
              >
                {{ errors.name }}
              </p>

              <ion-item>
                <ion-label position="stacked">
                  Email
                </ion-label>
                <ion-input
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  :disabled="isLoading"
                />
              </ion-item>
              <p
                v-if="errors.password"
                class="text-red-500 text-sm mt-1"
              >
                {{ errors.email }}
              </p>

              <ion-item>
                <ion-label position="stacked">
                  Password
                </ion-label>
                <ion-input
                  v-model="password"
                  type="password"
                  placeholder="Enter your password"
                  :disabled="isLoading"
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

              <ion-item>
                <ion-label position="stacked">
                  Confirm Password
                </ion-label>
                <ion-input
                  v-model="passwordConfirmation"
                  type="password"
                  placeholder="Confirm your password"
                  :disabled="isLoading"
                >
                  <ion-input-password-toggle slot="end" />
                </ion-input>
              </ion-item>
              <p
                v-if="errors.passwordConfirmation"
                class="text-red-500 text-sm mt-1"
              >
                {{ errors.passwordConfirmation }}
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
                    Sign Up
                  </p>
                </ion-button>
              </div>

              <!-- Error Display -->
              <ion-item
                v-if="signUpErrorMessage"
                color="danger"
              >
                <ion-icon
                  slot="start"
                  name="warning"
                />
                <ion-label>{{ signUpErrorMessage }}</ion-label>
              </ion-item>
            </form>
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
import type { SignUpDto } from '@/schemas'
import { toTypedSchema } from '@vee-validate/zod'
import to from 'await-to-js'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUp } from '@/api/auth'
import { RouteName } from '@/router/index'
import { signUpDtoSchema } from '@/schemas'

const router = useRouter()
const isLoading = ref(false)

const signUpSchema = toTypedSchema(signUpDtoSchema)

const { handleSubmit, errors } = useForm({
  validationSchema: signUpSchema,
})

const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: password } = useField('password')
// TODO: 換成小駝峯命名
const { value: passwordConfirmation } = useField('passwordConfirmation')

const signUpErrorMessage = ref('')

const onSubmit = handleSubmit(async (values: SignUpDto) => {
  signUpErrorMessage.value = ''
  isLoading.value = true

  const [err] = await to(signUp(values))

  if (err) {
    signUpErrorMessage.value = (err as any)?.response?.data?.message || 'Sign up failed'
    isLoading.value = false
    return
  }

  router.replace({ name: RouteName.LOGIN })
})
</script>

<style scoped>
ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}
</style>
