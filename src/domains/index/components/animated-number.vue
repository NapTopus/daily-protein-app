<template>
  <div>{{ displayedNumber }}</div>
</template>

<script
  setup
  lang="ts"
>
import gsap from 'gsap'
import { onMounted, ref, watch } from 'vue'

interface Props {
  to: number;
  duration?: number;
}
const props = withDefaults(defineProps<Props>(), {
  duration: 3,
})

const displayedNumber = ref(0)

watch(
  () => props.to,
  (newVal) => {
    animateTo(newVal)
  },
  { immediate: true },
)

function animateTo(value: number) {
  gsap.to(displayedNumber, {
    value,
    duration: props.duration,
    ease: 'power1.out',
    onUpdate: () => {
      displayedNumber.value = Math.round(displayedNumber.value)
    },
  })
}
</script>
