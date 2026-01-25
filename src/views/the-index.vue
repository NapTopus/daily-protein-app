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
        <display-card />
      </div>
    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import { computed, ref } from 'vue'
import DisplayCard from '@/domains/index/components/display-card.vue'
import MetaballBackground from '@/domains/index/components/metaball-background.vue'
import 'dayjs/locale/zh-tw'

// const metaBallColor = ref('#009AAF')
const metaBallColor = ref('#249aae')
const targetProtein = ref(100)
const todaysCurrentProtein = ref(10)
const metaBallCount = computed(() => {
  return Math.floor(todaysCurrentProtein.value / targetProtein.value * 100)
})
</script>
