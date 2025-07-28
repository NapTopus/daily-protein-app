<template>
  <div class="text-lg font-semibold mb-2">今日的蛋白質攝取</div>

  <div class="relative w-full max-w-[300px] mx-auto">
    <Doughnut
      :data="chartData"
      :options="chartOptions"
    />

    <!-- 中心文字 -->
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%] text-center">
      <div class="text-3xl font-bold text-primary">
        {{ animatedValue.toFixed(1) }}g
      </div>
      <div class="text-gray-400 text-sm">
        / {{ max }}g
      </div>
      <div class="text-gray-400 text-sm">
        達到目標還剩 {{ max - initialValue }}g
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { IonCard } from '@ionic/vue';
import { ref, computed, watch } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// 可動態更新的值
const initialValue = ref(20)  // 初始攝取值
const max = 77          // 目標攝取值

// 中心動畫數值顯示
const animatedValue = ref(0)

watch(initialValue, (newVal) => {
  let frame = requestAnimationFrame(function animate() {
    const diff = newVal - animatedValue.value
    if (Math.abs(diff) < 0.1) {
      animatedValue.value = newVal
    } else {
      animatedValue.value += diff * 0.1
      requestAnimationFrame(animate)
    }
  })
}, { immediate: true })

// 將 value 轉換為百分比
const percentage = computed(() => initialValue.value / max)

// Chart.js 資料
const chartData = computed(() => ({
  labels: ['已攝取', '剩餘'],
  datasets: [{
    data: [percentage.value, 1 - percentage.value],
    backgroundColor: ['#00CFFF', '#2F2F2F'],
    borderWidth: 0,
  }]
}))

// 圖表樣式
const chartOptions = {
  responsive: true,
  cutout: '80%',
  rotation: -90,
  circumference: 180,
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
}
</script>
