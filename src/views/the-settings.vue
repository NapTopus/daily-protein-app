<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      class="settings-page"
    >
      <div
        class="relative min-h-full overflow-hidden bg-[#050608] text-ink font-serif px-[28px]"
        :style="canvasPadStyle"
      >
        <div
          class="aurora absolute inset-x-[-15%] top-[-25%] h-3/4 pointer-events-none z-0"
          aria-hidden="true"
        />
        <div
          class="grain absolute inset-0 pointer-events-none opacity-7 mix-blend-overlay z-1"
          aria-hidden="true"
        />

        <div class="relative z-2 max-w-[520px] mx-auto">
          <header
            ref="headerRef"
            class="mb-[56px]"
          >
            <h1 class="text-[clamp(60px,18vw,96px)] leading-[0.92] font-500 tracking-[-0.025em] m-0 mb-[20px]">
              <span class="title-accent italic">Settings</span>
            </h1>
            <p class="m-0 text-ink/50 text-[15px] italic tracking-[0.01em]">
              Calibrate your daily ritual.
            </p>
          </header>

          <section
            ref="goalRef"
            class="relative mb-[56px]"
          >
            <div class="card-frame relative p-[28px_26px_22px] rounded-[22px] border border-ink/8 backdrop-blur-[18px] bg-gradient-to-b from-teal/6 to-white/1 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
              <div class="flex items-center gap-[10px] text-[11px] tracking-[0.28em] uppercase text-ink/50 font-500 mb-[22px]">
                <span class="w-[6px] h-[6px] rounded-full bg-teal shadow-[0_0_14px_rgba(43,181,206,0.9)]" />
                Daily protein goal
              </div>

              <div
                class="flex items-baseline gap-[18px] pt-[6px] pb-[18px] border-b transition-colors duration-600"
                :class="flash ? 'border-teal/70' : 'border-ink/8'"
              >
                <input
                  v-model.number="proteinGoal"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  class="goal-input flex-1 min-w-0 bg-transparent border-none outline-none text-ink font-serif text-[clamp(64px,16vw,84px)] font-500 tracking-[-0.04em] leading-1 p-0 transition-[text-shadow] duration-500"
                  :class="flash ? '[text-shadow:0_0_24px_rgba(43,181,206,0.7)]' : ''"
                  aria-label="Daily protein goal"
                >
                <div class="flex flex-col items-start shrink-0 pb-[14px]">
                  <span class="text-[32px] italic text-teal leading-1">g</span>
                </div>
              </div>

              <div class="flex items-center justify-end gap-[18px] mt-[18px] min-h-[36px]">
                <transition name="fade">
                  <span
                    v-if="saved"
                    class="inline-flex items-center gap-[8px] text-[11px] tracking-[0.28em] uppercase text-teal italic font-500"
                  >
                    <span class="w-[6px] h-[6px] rounded-full bg-teal shadow-[0_0_12px_#2bb5ce]" />
                    Saved
                  </span>
                </transition>
                <button
                  class="relative cursor-pointer px-[26px] py-[11px] rounded-full font-serif text-[12px] tracking-[0.28em] uppercase font-500 border transition-all duration-350 disabled:opacity-45 disabled:cursor-not-allowed enabled:active:scale-95"
                  :class="isDirty
                    ? 'bg-gradient-to-br from-teal to-teal-deep border-transparent text-white shadow-[0_8px_28px_rgba(43,181,206,0.45),inset_0_1px_0_rgba(255,255,255,0.18)]'
                    : 'bg-gradient-to-br from-teal/14 to-teal-deep/8 border-teal/22 text-ink/70'"
                  :disabled="!isDirty || saving"
                  @click="handleUpdateTargetProtein"
                >
                  {{ saving ? 'Saving' : 'Save' }}
                </button>
              </div>
            </div>
          </section>

          <div class="h-px w-full mb-[32px] bg-gradient-to-r from-transparent via-ink/10 to-transparent" />

          <section
            ref="accountRef"
            class="mb-[72px]"
          >
            <div class="flex items-center gap-[10px] text-[11px] tracking-[0.28em] uppercase text-ink/50 font-500 mb-[14px]">
              <span class="w-[6px] h-[6px] rounded-full bg-ink/50" />
              Account
            </div>
            <button
              class="group flex w-full items-center justify-between py-[18px] px-[4px] bg-transparent border-x-0 border-y border-ink/8 text-ink font-serif text-[19px] font-500 italic cursor-pointer transition-[color,border-color] duration-250 hover:text-danger-soft hover:border-danger-soft/30 active:text-danger-soft active:border-danger-soft/30"
              @click="handleLogout"
            >
              <span>Sign out</span>
              <ion-icon
                :icon="arrowForwardOutline"
                class="text-[20px] text-ink/50 transition-[transform,color] duration-300 group-hover:translate-x-[5px] group-hover:text-danger-soft group-active:translate-x-[5px] group-active:text-danger-soft"
              />
            </button>
          </section>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import { IonContent, IonIcon, IonPage } from '@ionic/vue'
import gsap from 'gsap'
import { arrowForwardOutline } from 'ionicons/icons'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/store/auth-store'
import { useUserStore } from '@/store/user-store'

const authStore = useAuthStore()
const userStore = useUserStore()

onMounted(() => userStore.fetchUserInfo())

const proteinGoal = ref(0)
const saving = ref(false)
const saved = ref(false)
const flash = ref(false)

const canvasPadStyle = {
  paddingTop: 'calc(env(safe-area-inset-top, 0px) + 64px)',
  paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 120px)',
}

watch(
  () => userStore.userInfo?.defaultTarget,
  (val) => {
    if (val !== undefined)
      proteinGoal.value = val
  },
  { immediate: true },
)

const isDirty = computed(() => {
  const current = userStore.userInfo?.defaultTarget ?? 0
  return proteinGoal.value !== current && proteinGoal.value > 0
})

const headerRef = ref<HTMLElement | null>(null)
const goalRef = ref<HTMLElement | null>(null)
const accountRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const targets = [headerRef.value, goalRef.value, accountRef.value].filter(Boolean) as HTMLElement[]
  if (!targets.length)
    return
  gsap.fromTo(
    targets,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' },
  )
})

function handleLogout() {
  authStore.logout()
  window.location.href = '/login'
}

async function handleUpdateTargetProtein() {
  if (!isDirty.value || saving.value)
    return
  saving.value = true
  try {
    await userStore.updateTarget(proteinGoal.value)
    saved.value = true
    flash.value = true
    setTimeout(() => {
      flash.value = false
    }, 700)
    setTimeout(() => {
      saved.value = false
    }, 1800)
  }
  finally {
    saving.value = false
  }
}
</script>

<style
  lang="scss"
  scoped
>
.settings-page {
  --background: #050608;
  --color: #f5f1e8;
}

.aurora {
  background:
    radial-gradient(60% 50% at 28% 18%, rgba(43, 181, 206, 0.32), transparent 62%),
    radial-gradient(45% 40% at 82% 8%, rgba(26, 122, 143, 0.22), transparent 65%),
    radial-gradient(80% 60% at 50% 0%, rgba(43, 181, 206, 0.08), transparent 70%);
  filter: blur(8px);
}

.grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

.title-accent {
  background: linear-gradient(180deg, #ffffff 10%, #2bb5ce 130%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 80px rgba(43, 181, 206, 0.35);
}

.card-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 22px;
  padding: 1px;
  background: linear-gradient(160deg, rgba(43, 181, 206, 0.55) 0%, rgba(43, 181, 206, 0.05) 35%, transparent 70%);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.goal-input {
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(8px);
}
</style>
