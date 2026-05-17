<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      class="signup-content"
    >
      <!-- 上層光暈 -->
      <div
        class="absolute inset-0 pointer-events-none opacity-80 bg-[radial-gradient(ellipse_at_50%_-15%,rgba(36,154,174,0.28),transparent_55%)]"
        aria-hidden="true"
      />
      <!-- 底部地平線微光 -->
      <div
        class="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none opacity-60 bg-[radial-gradient(ellipse_at_50%_120%,rgba(43,181,206,0.18),transparent_60%)]"
        aria-hidden="true"
      />

      <div
        class="relative z-10 flex-col px-7 pb-[6vh] max-w-[440px] mx-auto min-h-full"
        style="padding-top: max(9vh, calc(var(--ion-safe-area-top, 0px) + 48px))"
      >
        <!-- 標題 -->
        <header class="flex-col gap-2 mb-9">
          <div class="flex items-center gap-3">
            <span class="block h-px w-7 bg-teal/70" />
            <span class="text-[10px] uppercase tracking-[0.36em] text-teal/80">
              Daily Protein
            </span>
          </div>
          <h1 class="m-0 font-serif text-[38px] leading-[1.05] text-ink tracking-tight">
            Begin your<br>ledger
          </h1>
          <p class="m-0 mt-1 text-[13px] text-white/45 tracking-wide">
            Create an account to start tracking.
          </p>
        </header>

        <!-- 表單 -->
        <form
          class="flex-col gap-6"
          @submit.prevent="onSubmit"
        >
          <!-- Name -->
          <div class="flex-col gap-2">
            <label
              for="name-input"
              class="text-[12px] text-white/45"
            >
              Name
            </label>
            <input
              id="name-input"
              ref="nameInput"
              v-model="name"
              type="text"
              autocomplete="name"
              placeholder="Your name"
              :disabled="isLoading"
              class="w-full bg-transparent border-0 outline-none text-white font-serif text-[20px] py-2 border-b border-white/12 focus:border-teal placeholder-white/22 transition-colors duration-300 disabled:opacity-50"
              @blur="() => { nameBlur(); validateName() }"
            >
            <transition name="fade">
              <p
                v-if="errors.name"
                class="m-0 text-[12px] text-danger-soft"
              >
                {{ errors.name }}
              </p>
            </transition>
          </div>

          <!-- Email -->
          <div class="flex-col gap-2">
            <label
              for="email-input"
              class="text-[12px] text-white/45"
            >
              Email
            </label>
            <input
              id="email-input"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :disabled="isLoading"
              class="w-full bg-transparent border-0 outline-none text-white font-serif text-[20px] py-2 border-b border-white/12 focus:border-teal placeholder-white/22 transition-colors duration-300 disabled:opacity-50"
              @blur="() => { emailBlur(); validateEmail() }"
            >
            <transition name="fade">
              <p
                v-if="errors.email"
                class="m-0 text-[12px] text-danger-soft"
              >
                {{ errors.email }}
              </p>
            </transition>
          </div>

          <!-- Password -->
          <div class="flex-col gap-2">
            <label
              for="password-input"
              class="text-[12px] text-white/45"
            >
              Password
            </label>
            <div class="flex items-center gap-2 border-b border-white/12 focus-within:border-teal transition-colors duration-300">
              <input
                id="password-input"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="••••••••"
                :disabled="isLoading"
                class="flex-1 min-w-0 bg-transparent border-0 outline-none text-white font-serif text-[20px] py-2 placeholder-white/22 disabled:opacity-50 tracking-[0.05em]"
                @blur="() => { passwordBlur(); validatePassword() }"
              >
              <button
                type="button"
                class="eye-btn shrink-0 p-1.5 -mr-1.5 bg-transparent border-0 appearance-none cursor-pointer text-white/35 hover:text-teal transition-colors duration-200"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="eye-icon"
                  :class="{ 'is-open': showPassword }"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 12s3.4-6.5 9.5-6.5S21.5 12 21.5 12 18.1 18.5 12 18.5 2.5 12 2.5 12z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="2.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <line
                    class="slash"
                    x1="4.5"
                    y1="19.5"
                    x2="19.5"
                    y2="4.5"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                  <line
                    class="slash-bg"
                    x1="3.5"
                    y1="20.5"
                    x2="20.5"
                    y2="3.5"
                    stroke="#0b0d0e"
                    stroke-width="2.2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <transition name="fade">
              <p
                v-if="errors.password"
                class="m-0 text-[12px] text-danger-soft"
              >
                {{ errors.password }}
              </p>
            </transition>
          </div>

          <!-- Confirm Password -->
          <div class="flex-col gap-2">
            <label
              for="password-confirm-input"
              class="text-[12px] text-white/45"
            >
              Confirm password
            </label>
            <div class="flex items-center gap-2 border-b border-white/12 focus-within:border-teal transition-colors duration-300">
              <input
                id="password-confirm-input"
                v-model="passwordConfirmation"
                :type="showPasswordConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="••••••••"
                :disabled="isLoading"
                class="flex-1 min-w-0 bg-transparent border-0 outline-none text-white font-serif text-[20px] py-2 placeholder-white/22 disabled:opacity-50 tracking-[0.05em]"
                @blur="() => { passwordConfirmationBlur(); validatePasswordConfirmation() }"
              >
              <button
                type="button"
                class="eye-btn shrink-0 p-1.5 -mr-1.5 bg-transparent border-0 appearance-none cursor-pointer text-white/35 hover:text-teal transition-colors duration-200"
                :aria-label="showPasswordConfirm ? 'Hide password' : 'Show password'"
                @click="showPasswordConfirm = !showPasswordConfirm"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="eye-icon"
                  :class="{ 'is-open': showPasswordConfirm }"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 12s3.4-6.5 9.5-6.5S21.5 12 21.5 12 18.1 18.5 12 18.5 2.5 12 2.5 12z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="2.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <line
                    class="slash"
                    x1="4.5"
                    y1="19.5"
                    x2="19.5"
                    y2="4.5"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                  <line
                    class="slash-bg"
                    x1="3.5"
                    y1="20.5"
                    x2="20.5"
                    y2="3.5"
                    stroke="#0b0d0e"
                    stroke-width="2.2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <transition name="fade">
              <p
                v-if="errors.passwordConfirmation"
                class="m-0 text-[12px] text-danger-soft"
              >
                {{ errors.passwordConfirmation }}
              </p>
            </transition>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full overflow-hidden rounded-full py-3.5 mt-3 bg-gradient-to-r from-teal to-teal-deep transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 shadow-[0_10px_28px_-10px_rgba(36,154,174,0.85),inset_0_1px_0_rgba(255,255,255,0.18)]"
          >
            <span
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
              aria-hidden="true"
            />
            <span class="relative z-10 flex-center gap-2 font-serif text-[15px] tracking-wide text-white">
              <template v-if="isLoading">
                <span class="loading-dot" />
                <span>Creating…</span>
              </template>
              <template v-else>
                <span>Create account</span>
                <ion-icon
                  :icon="arrowForwardOutline"
                  class="text-[14px]"
                />
              </template>
            </span>
          </button>

          <!-- 註冊錯誤 -->
          <transition name="fade">
            <div
              v-if="signUpErrorMessage"
              class="flex items-start gap-2 px-3 py-2.5 rounded-lg border border-danger-soft/30 bg-danger-soft/10"
            >
              <ion-icon
                :icon="warningOutline"
                class="text-danger-soft text-[16px] shrink-0 mt-0.5"
              />
              <span class="text-danger-soft text-[12.5px] leading-snug">
                {{ signUpErrorMessage }}
              </span>
            </div>
          </transition>
        </form>

        <!-- 底部 Login 連結 -->
        <div class="mt-auto pt-10 text-center text-[13px] text-white/40">
          Already have an account?
          <router-link
            :to="{ name: RouteName.LOGIN }"
            class="relative ml-1 text-teal group"
          >
            Sign in
            <span class="absolute left-0 -bottom-0.5 h-px w-full bg-teal/40 group-hover:bg-teal transition-colors" />
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
import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/vue'
import { toTypedSchema } from '@vee-validate/zod'
import to from 'await-to-js'
import { arrowForwardOutline, warningOutline } from 'ionicons/icons'
import { useField, useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUp } from '@/api/auth'
import { RouteName } from '@/router/index'
import { signUpDtoSchema } from '@/schemas'

const router = useRouter()
const isLoading = ref(false)
const signUpErrorMessage = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)

const signUpSchema = toTypedSchema(signUpDtoSchema)

const { handleSubmit, errors } = useForm({
  validationSchema: signUpSchema,
})

const { value: name, handleBlur: nameBlur, validate: validateName } = useField('name', undefined, {
  validateOnValueUpdate: false,
})

const { value: email, handleBlur: emailBlur, validate: validateEmail } = useField('email', undefined, {
  validateOnValueUpdate: false,
})

const { value: password, handleBlur: passwordBlur, validate: validatePassword } = useField('password', undefined, {
  validateOnValueUpdate: false,
})

const { value: passwordConfirmation, handleBlur: passwordConfirmationBlur, validate: validatePasswordConfirmation } = useField('passwordConfirmation', undefined, {
  validateOnValueUpdate: false,
})

onMounted(() => {
  setTimeout(() => nameInput.value?.focus(), 280)
})

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

<style
  lang="scss"
  scoped
>
.signup-content {
  --background: #0b0d0e;
}

// 拿掉行動裝置上 button 預設的灰色 tap highlight 與 focus 底色
.eye-btn {
  -webkit-tap-highlight-color: transparent;
  outline: none;

  &:focus,
  &:focus-visible,
  &:active {
    background: transparent;
    box-shadow: none;
  }
}

// 眼睛 + 斜線動畫：點擊時斜線平滑畫出/抹除
.eye-icon {
  width: 20px;
  height: 20px;
  display: block;
  overflow: visible;

  .slash,
  .slash-bg {
    stroke-dasharray: 24;
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  }

  &.is-open {
    .slash,
    .slash-bg {
      stroke-dashoffset: 24;
    }
  }
}

// 載入中的呼吸圓點
.loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  animation: dot-pulse 1.1s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.85); }
  50%      { opacity: 1; transform: scale(1.15); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
