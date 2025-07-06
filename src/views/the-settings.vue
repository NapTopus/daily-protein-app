<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>設置</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">設置</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="pb-[20px]">
        <ion-card-header>
          <ion-card-title>每日目標</ion-card-title>
        </ion-card-header>

        <div class="flex items-center justify-start space-x-sm px-[20px]">
          <ion-item>
            <ion-input
              @ionChange="handleProteinGoalChange"
              type="number"
              class="!w-[80px]"
              inputmode="numeric"
            ></ion-input>
          </ion-item>
          <p class="text-2xl font-bold m-0">g</p>
        </div>
      </ion-card>

      <ion-card class="pb-[20px]">
        <ion-card-header>
          <ion-card-title>一週的第一天</ion-card-title>
        </ion-card-header>

        <div class="px-[20px]">
          <ion-segment
            :value="weekStartDay"
            @ionChange="handleWeekStartDayChange"
          >
            <ion-segment-button value="monday">
              <ion-label class="text-lg">星期一</ion-label>
            </ion-segment-button>
            <ion-segment-button value="sunday">
              <ion-label class="text-lg">星期日</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
import { isEmpty } from 'lodash-es'
import { ref } from 'vue';

/** 設定蛋白質目標 */
function handleProteinGoalChange(event: CustomEvent) {
  const value = event.detail.value
  if (!isEmpty(value)) {
    // TODO: API 提交蛋白質目標變更
    console.log('每日蛋白質目標已更新為：', value);
  }
}

const weekStartDay = ref('monday')

/** 設定一週中的第一天 */
function handleWeekStartDayChange(event: CustomEvent) {
  weekStartDay.value = event.detail.value
  console.log('目前選中的是：', weekStartDay.value)
}
</script>
