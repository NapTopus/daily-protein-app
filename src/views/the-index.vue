<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="w-full h-100vh relative bg-black flex items-center justify-center">
        <metaball-background
          :color="metaBallColor"
          :opacity="0.3"
          :count="metaBallCount"
          class="absolute inset-0"
        />
        <display-card
          :current-protein="todaysCurrentProtein"
          class="relative z-10"
        />
      </div>

      <!-- 右下角新增按鈕 -->
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        class="mr-[22px]"
        style="margin-bottom: calc(var(--ion-safe-area-bottom, 0px) + 96px)"
      >
        <button
          type="button"
          class="add-fab"
          aria-label="Add entry"
          @click="openModal"
        >
          <span
            class="aura"
            aria-hidden="true"
          />
          <span class="blob">
            <span
              class="surface"
              aria-hidden="true"
            />
            <span class="counter">
              <svg
                viewBox="0 0 24 24"
                class="plus"
                aria-hidden="true"
              >
                <path d="M12 6v12M6 12h12" />
              </svg>
            </span>
          </span>
        </button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import {
  IonContent,
  IonFab,
  IonPage,
  modalController,
} from '@ionic/vue'
import { useAsyncState } from '@vueuse/core'
import to from 'await-to-js'
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { getRecords } from '@/api/record'
import AddRecordForm from '@/domains/index/components/add-record-form.vue'
import DisplayCard from '@/domains/index/components/display-card.vue'
import MetaballBackground from '@/domains/index/components/metaball-background.vue'
import { useUserStore } from '@/store/user-store'
import 'dayjs/locale/zh-tw'

const userStore = useUserStore()

const metaBallColor = ref('#249aae')
const targetProtein = computed(() => userStore.userInfo?.defaultTarget || 100)

// 取得當天日期
const today = dayjs().format('YYYY-MM-DD')

const { state: items } = useAsyncState(
  async () => {
    const [err, res] = await to(getRecords({ from: today }))
    if (err) {
      console.error('Failed to fetch records:', err)
      return
    }
    return res.data[0]?.items || []
  },
  [],
)

const todaysCurrentProtein = computed(() => {
  if (!items.value)
    return 0

  const totalProtein = (items.value as any[]).reduce((acc: number, item: any) => {
    return acc + (item.protein || 0)
  }, 0)
  return totalProtein
})

const metaBallCount = computed(() => {
  const count = Math.max(Math.floor(todaysCurrentProtein.value / targetProtein.value * 100), 10) // Ensure a minimum count of 10
  return count
})

async function openModal() {
  const modal = await modalController.create({
    component: AddRecordForm,
    breakpoints: [0, 0.75, 1],
    initialBreakpoint: 0.75,
    componentProps: {
      onDismiss: () => modal.dismiss(),
    },
  })
  await modal.present()
}

onMounted(() => {
  if (!userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})
</script>

<style
  lang="scss"
  scoped
>
.add-fab {
  position: relative;
  width: 64px;
  height: 64px;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:active {
    transform: scale(0.9);
  }
}

// 與主體同步扭動的柔光
.aura {
  position: absolute;
  inset: -16px;
  background: radial-gradient(circle, rgba(43, 181, 206, 0.65) 0%, rgba(43, 181, 206, 0) 65%);
  filter: blur(12px);
  border-radius: 60% 40% 50% 70% / 60% 50% 70% 40%;
  animation:
    blob-morph 8s ease-in-out infinite,
    aura-breathe 3.6s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

// 主 blob — 慢轉 + 邊緣 morph，呼應背景 metaball
.blob {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60% 40% 50% 70% / 60% 50% 70% 40%;
  background: conic-gradient(
    from 0deg,
    #146f82 0deg,
    #2bb5ce 110deg,
    #7fe9f5 180deg,
    #2bb5ce 250deg,
    #146f82 360deg
  );
  box-shadow:
    0 18px 38px -12px rgba(36, 154, 174, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -2px 6px rgba(0, 0, 0, 0.28);
  animation:
    blob-morph 8s ease-in-out infinite,
    blob-spin 14s linear infinite;
  overflow: hidden;
}

// 玻璃高光與底陰影：增加球體立體感
.surface {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.5), transparent 50%),
    radial-gradient(circle at 72% 80%, rgba(0, 0, 0, 0.22), transparent 55%);
  pointer-events: none;
}

// 反向旋轉容器，讓「+」維持正向
.counter {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: blob-spin 14s linear infinite reverse;
}

.plus {
  width: 22px;
  height: 22px;
  stroke: #fff;
  stroke-width: 1.7;
  stroke-linecap: round;
  fill: none;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
}

@keyframes blob-morph {
  0%, 100% { border-radius: 60% 40% 50% 70% / 60% 50% 70% 40%; }
  25%      { border-radius: 40% 60% 70% 30% / 50% 70% 30% 50%; }
  50%      { border-radius: 50% 50% 30% 70% / 70% 40% 60% 30%; }
  75%      { border-radius: 70% 30% 60% 40% / 40% 60% 50% 70%; }
}

@keyframes blob-spin {
  to { transform: rotate(360deg); }
}

@keyframes aura-breathe {
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 0.95; }
}
</style>
