<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      class="login-content"
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
        class="relative z-10 flex-col px-7 pb-[8vh] max-w-[440px] mx-auto h-full"
        style="padding-top: max(16vh, calc(var(--ion-safe-area-top, 0px) + 64px))"
      >
        <!-- 標題 -->
        <header class="flex-col gap-2 mb-12">
          <div class="flex items-center gap-3">
            <span class="block h-px w-7 bg-teal/70" />
            <span class="text-[10px] uppercase tracking-[0.36em] text-teal/80">
              Daily Protein
            </span>
          </div>
          <h1 class="m-0 font-serif text-[40px] leading-[1.05] text-ink tracking-tight">
            Welcome<br>back
          </h1>
          <p class="m-0 mt-1 text-[13px] text-white/45 tracking-wide">
            Sign in to continue your protein log.
          </p>
        </header>

        <!-- 表單 -->
        <form
          class="flex-col gap-7"
          @submit.prevent="onSubmit"
        >
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
              ref="emailInput"
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
                autocomplete="current-password"
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
                  <!-- 眼眶 -->
                  <path
                    d="M2.5 12s3.4-6.5 9.5-6.5S21.5 12 21.5 12 18.1 18.5 12 18.5 2.5 12 2.5 12z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- 瞳孔 -->
                  <circle
                    cx="12"
                    cy="12"
                    r="2.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <!-- 斜線（password 隱藏時可見，顯示時擦除） -->
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
                  <!-- 斜線下方的描影（讓斜線跟眼眶有立體分隔） -->
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
                <span>Signing in…</span>
              </template>
              <template v-else>
                <span>Sign in</span>
                <ion-icon
                  :icon="arrowForwardOutline"
                  class="text-[14px]"
                />
              </template>
            </span>
          </button>

          <!-- 登入錯誤 -->
          <transition name="fade">
            <div
              v-if="loginErrorMessage"
              class="flex items-start gap-2 px-3 py-2.5 rounded-lg border border-danger-soft/30 bg-danger-soft/10"
            >
              <ion-icon
                :icon="warningOutline"
                class="text-danger-soft text-[16px] shrink-0 mt-0.5"
              />
              <span class="text-danger-soft text-[12.5px] leading-snug">
                {{ loginErrorMessage }}
              </span>
            </div>
          </transition>
        </form>

        <!-- 底部 Sign up 連結 -->
        <div class="mt-auto pt-10 text-center text-[13px] text-white/40">
          New here?
          <router-link
            :to="{ name: `${RouteName.SIGN_UP}` }"
            class="relative ml-1 text-teal group"
          >
            Create an account
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
import type { LoginDto } from '@/schemas'
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
import { login } from '@/api/auth'
import { RouteName } from '@/router'
import { loginDtoSchema } from '@/schemas'
import { useAuthStore } from '@/store/auth-store'

const loginSchema = toTypedSchema(loginDtoSchema)

const router = useRouter()
const { setAccessToken } = useAuthStore()
const loginErrorMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)

const { handleSubmit, errors } = useForm({
  validationSchema: loginSchema,
})

const { value: email, handleBlur: emailBlur, validate: validateEmail } = useField('email', undefined, {
  validateOnValueUpdate: false,
})

const { value: password, handleBlur: passwordBlur, validate: validatePassword } = useField('password', undefined, {
  validateOnValueUpdate: false,
})

onMounted(() => {
  setTimeout(() => emailInput.value?.focus(), 280)
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

<style
  lang="scss"
  scoped
>
.login-content {
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
    stroke-dashoffset: 0; // 預設：斜線完整出現（密碼隱藏中）
    transition: stroke-dashoffset 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  }

  &.is-open {
    .slash,
    .slash-bg {
      stroke-dashoffset: 24; // 顯示密碼時：斜線抹除
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
