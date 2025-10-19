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
        <div
          ref="mainSection"
          class="border border-[1px] border-solid rounded-2xl px-10 py-8 bg-[rgba(0,0,0,0.1)] backdrop-blur-[10px] border-[#3b3b3b] shadow-[0_0_20px_rgba(36,154,174,0.8)]"
        >
          <h2 class="text-white z-100 text-[20px] text-left font-500 pb-[5px]">
            Today's Protein
          </h2>
          <!-- <p class="text-[14px] text-right mt-[3px] mb-0">
            {{ todaysDate }}
          </p> -->
          <div class="flex items-end justify-center">
            <animated-number
              class="text-[70px] min-w-[85px] font-600"
              :to="todaysCurrentProtein"
            />
            <span class="text-[35px]">
              / {{ targetProtein }}
            </span>
            <span class="text-[15px] translate-y-[-6px]">&nbsp;(g)</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import dayjs from 'dayjs'
import gsap from 'gsap'
import { computed, onMounted, ref } from 'vue'
import MetaballBackground from '@/components/metaball-background.vue'
import 'dayjs/locale/zh-tw'

// dayjs.locale('zh-tw')

const todaysDate = computed(() => {
  return dayjs().format('YYYY.MM.DD (dddd)')
})

// const metaBallColor = ref('#009AAF')
const metaBallColor = ref('#249aae')
const targetProtein = ref(100)
const todaysCurrentProtein = ref(10)
const metaBallCount = computed(() => {
  return Math.floor(todaysCurrentProtein.value / targetProtein.value * 100)
})

const mainSection = ref<HTMLElement | null>(null)

onMounted(() => {
  if (mainSection.value) {
    gsap.fromTo(
      mainSection.value,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 2.5,
        ease: 'power2.out',
      },
    )
  }
})
</script>
