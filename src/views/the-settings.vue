<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Settings
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="pb-[20px]">
        <ion-card-header>
          <ion-card-title>Daily Protein Goal</ion-card-title>
        </ion-card-header>

        <div class="flex items-center justify-between px-[20px]">
          <div class="flex items-center justify-start space-x-sm">
            <ion-item>
              <ion-input
                v-model.number="proteinGoal"
                type="number"
                class="!w-[80px]"
                inputmode="numeric"
              />
            </ion-item>
            <p class="text-xl font-bold m-0">
              g
            </p>
          </div>
          <ion-button @click="handleUpdateTargetProtein">
            save
          </ion-button>
        </div>
      </ion-card>

      <!-- <ion-card class="pb-[20px]">
        <ion-card-header>
          <ion-card-title>一週的第一天</ion-card-title>
        </ion-card-header>

        <div class="px-[20px]">
          <ion-segment
            :value="weekStartDay"
            @ion-change="handleWeekStartDayChange"
          >
            <ion-segment-button value="monday">
              <ion-label class="text-lg">
                星期一
              </ion-label>
            </ion-segment-button>
            <ion-segment-button value="sunday">
              <ion-label class="text-lg">
                星期日
              </ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>
      </ion-card> -->

      <!-- logout -->
      <div class="ion-padding">
        <ion-button
          expand="block"
          color="danger"
          @click="handleLogout"
        >
          Logout
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/store/auth-store'
import { useUserStore } from '@/store/user-store'

const authStore = useAuthStore()

const userStore = useUserStore()
onMounted(() => userStore.fetchUserInfo())

const proteinGoal = ref(0)

watch(
  () => userStore.userInfo?.defaultTarget,
  (val) => {
    if (val !== undefined)
      proteinGoal.value = val
  },
  { immediate: true },
)

// const weekStartDay = ref('monday')

/** 設定一週中的第一天 */
// function handleWeekStartDayChange(event: CustomEvent) {
//   weekStartDay.value = event.detail.value
//   console.log('目前選中的是：', weekStartDay.value)
// }

function handleLogout() {
  authStore.logout()
  window.location.href = '/login'
}

/** 更新蛋白質目標 */
async function handleUpdateTargetProtein() {
  await userStore.updateTarget(proteinGoal.value)
}
</script>
