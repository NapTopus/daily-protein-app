<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>今日的蛋白質</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            今日的蛋白質
          </ion-title>
          <p class="font-500 text-secondary-grey text-[18px] pl-[15px] my-0">
            {{ todaysDate }}
          </p>
        </ion-toolbar>
      </ion-header>
      <!-- 內容 -->
      <ion-page>
        <ion-content>
          <!-- 圖表 -->
          <div class="px-[20px] pt-[40px]">
            <single-gauge-chart />
          </div>
          <!-- 表單 -->
          <ion-card>
            <ion-card-content>
              <ion-list
                lines="full"
                class="ion-no-margin"
              >
                <ion-item>
                  <ion-label position="stacked">
                    蛋白質攝取量（g）
                  </ion-label>
                  <ion-input
                    v-model="createProteinForm.protein"
                    type="number"
                    placeholder="輸入數值"
                  />
                </ion-item>

                <ion-item>
                  <ion-label position="stacked">
                    攝取時間
                  </ion-label>
                  <!-- <ion-datetime-button datetime="time"></ion-datetime-button> -->
                  <!-- <ion-modal trigger="time">
                    <ion-datetime
                      id="time"
                      presentation="time"
                    ></ion-datetime>
                  </ion-modal> -->
                </ion-item>

                <!-- 其他欄位 -->

                <ion-button
                  expand="block"
                  class="mt-6"
                  @click="submit"
                >
                  儲存紀錄
                </ion-button>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </ion-content>
      </ion-page>
    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import { useAsyncState } from '@vueuse/core'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import SingleGaugeChart from '@/components/single-gauge-chart.vue'
import 'dayjs/locale/zh-tw'

dayjs.locale('zh-tw')

const todaysDate = computed(() => {
  return dayjs().format('YYYY-MM-DD (dddd)')
})

const createProteinForm = ref({
  protein: '',
  time: '',
})

function submit() {
  console.log('submit')
}

// fetch('https://jsonplaceholder.typicode.com/todos/1')
//   .then(response => response.json())
//   .then(json => console.log(json))
</script>
