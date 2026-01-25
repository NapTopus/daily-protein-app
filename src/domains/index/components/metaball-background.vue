<template>
  <div
    class="wrap"
    :style="{ opacity: props.opacity }"
  >
    <canvas ref="canvasRef" />
  </div>
</template>

<script
  setup
  lang="ts"
>
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  color?: string;
  opacity?: number;
  count?: number;
}
const props = withDefaults(defineProps<Props>(), {
  color: '#000',
  opacity: 1,
  count: 10,
})

const BLUR_PADDING = 10 // 避免模糊邊緣被裁切

interface Ball {
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
  startTime: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number
let balls: Ball[] = []

function initBalls(width: number, height: number) {
  const result: Ball[] = []
  const now = performance.now()
  for (let i = 0; i < props.count; i++) {
    const size = Math.floor(Math.random() * 50 + 50)
    const duration = Math.random() * 12 + 8
    const delay = Math.random() * -6
    const angle = Math.random() * Math.PI * 2 // 隨機方向
    const speed = size / 150 // 越大越快

    result.push({
      x: width / 2,
      y: height / 2,
      size,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      duration,
      delay,
      startTime: now + delay * 1000,
    })
  }
  return result
}

function animate(time: number) {
  if (!ctx || !canvasRef.value)
    return

  const canvas = canvasRef.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const visibleLeft = BLUR_PADDING
  const visibleRight = canvas.width - BLUR_PADDING
  const visibleTop = BLUR_PADDING
  const visibleBottom = canvas.height - BLUR_PADDING

  for (const ball of balls) {
    if (time < ball.startTime)
      continue

    const radius = ball.size / 2

    // 移動位置
    ball.x += ball.dx
    ball.y += ball.dy

    // 邊界反彈邏輯
    if (ball.x - radius <= visibleLeft || ball.x + radius >= visibleRight) {
      ball.dx *= -1
      ball.x = Math.max(visibleLeft + radius, Math.min(visibleRight - radius, ball.x))
    }

    if (ball.y - radius <= visibleTop || ball.y + radius >= visibleBottom) {
      ball.dy *= -1
      ball.y = Math.max(visibleTop + radius, Math.min(visibleBottom - radius, ball.y))
    }

    // 繪製圓形
    ctx.beginPath()
    ctx.fillStyle = props.color
    ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  animationFrameId = requestAnimationFrame(animate)
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas)
    return

  const width = canvas.offsetWidth
  const height = canvas.offsetHeight

  canvas.width = width + BLUR_PADDING * 2
  canvas.height = height + BLUR_PADDING * 2

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  balls = initBalls(canvas.width, canvas.height)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    ctx = canvas.getContext('2d')

    requestAnimationFrame(() => {
      resizeCanvas()
      animationFrameId = requestAnimationFrame(animate)
    })

    window.addEventListener('resize', resizeCanvas)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  inset: 0;
  background: black;
  filter: blur(15px) contrast(25);
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
