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
        <display-card class="relative z-10" />
      </div>

      <!-- 右下角新增按鈕 -->
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        class="mr-[25px]"
        style="margin-bottom: calc(var(--ion-safe-area-bottom, 0px) + 96px)"
      >
        <div class="fab-wrapper">
          <ion-fab-button
            @click="openModal"
            class="add-fab"
          >
            <ion-icon
              :icon="addOutline"
              class="add-icon"
            />
          </ion-fab-button>
        </div>
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
  IonFabButton,
  IonIcon,
  IonPage,
  modalController,
} from '@ionic/vue'
import { useAsyncState } from '@vueuse/core'
import to from 'await-to-js'
import { addOutline } from 'ionicons/icons'
import { computed, ref } from 'vue'
import { getUserInfo } from '@/api/user'
import AddRecordForm from '@/domains/index/components/add-record-form.vue'
import DisplayCard from '@/domains/index/components/display-card.vue'
import MetaballBackground from '@/domains/index/components/metaball-background.vue'
import 'dayjs/locale/zh-tw'
import { getRecords } from '@/api/record'
import dayjs from 'dayjs'

const metaBallColor = ref('#249aae')
const targetProtein = ref(100)
const todaysCurrentProtein = ref(10)
const metaBallCount = computed(() => {
  return Math.floor(todaysCurrentProtein.value / targetProtein.value * 100)
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

const { state: userInfo } = useAsyncState(
  async () => {
    const [err, res] = await to(getUserInfo())
    if (err) {
      console.error('取得用戶資訊失敗：', err)
      return
    }
    return res.data
  },
  { target: 0 },
)

// 取得當天日期
const today = dayjs().format('YYYY-MM-DD')


const { state: items } = useAsyncState(
  async () => {
    const [err, res] = await to(getRecords({ from: today }))
    if (err) {
      console.error('取得蛋白質紀錄失敗：', err)
      return
    }
    return res.data
  },
  [],
)
</script>

<style
  lang="scss"
  scoped
>
.fab-wrapper {
  position: relative;
  width: 56px;
  height: 56px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    background: rgba(36, 154, 174, 0.55);
    animation: fab-pulse 2.2s ease-out infinite;
    pointer-events: none;
    z-index: 0;
  }
}

.add-fab {
  --background: linear-gradient(135deg, #2bb5ce 0%, #1a7a8f 100%);
  --background-activated: #1a7a8f;
  --border-radius: 18px;
  --box-shadow: 0 8px 28px rgba(36, 154, 174, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  position: relative;
  z-index: 1;
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:active {
    transform: scale(0.91);
  }

  .add-icon {
    font-size: 26px;
    color: #fff;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
  }
}

@keyframes fab-pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }

  70% {
    transform: scale(1.65);
    opacity: 0;
  }

  100% {
    transform: scale(1.65);
    opacity: 0;
  }
}
</style>
