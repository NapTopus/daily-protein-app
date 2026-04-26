<template>
  <ion-content
    :scroll-y="true"
    class="custom-content"
  >
    <!-- 關閉按鈕 -->
    <button
      type="button"
      class="absolute top-3 right-4 z-20 w-9 h-9 flex-center rounded-full text-white/40 hover:text-white/85 transition-colors duration-200"
      aria-label="Close"
      @click="props.onDismiss?.()"
    >
      <ion-icon
        :icon="closeOutline"
        class="text-[22px]"
      />
    </button>

    <form
      class="relative px-7 pt-4 pb-10 flex-col gap-8"
      @submit.prevent="handleSubmit"
    >
      <!-- 標題 -->
      <h2 class="m-0 font-serif text-[26px] leading-tight text-ink tracking-tight">
        Add entry
      </h2>

      <!-- Food（主要：最大、自動聚焦） -->
      <div class="flex-col gap-2">
        <label
          for="food-input"
          class="text-[12px] text-white/45"
        >
          What did you eat?
        </label>
        <input
          id="food-input"
          ref="foodInput"
          v-model="form.name"
          type="text"
          placeholder="Soft-boiled egg"
          required
          class="w-full bg-transparent border-0 outline-none text-white font-serif text-[22px] leading-[1.4] py-2 border-b border-white/12 focus:border-teal placeholder-white/22 transition-colors duration-300"
        >
      </div>

      <!-- Protein（次要：保持節奏） -->
      <div class="flex-col gap-2">
        <label
          for="protein-input"
          class="text-[12px] text-white/45"
        >
          How much protein?
        </label>
        <div class="flex items-baseline gap-2.5 border-b border-white/12 focus-within:border-teal transition-colors duration-300">
          <input
            id="protein-input"
            v-model.number="form.protein"
            type="number"
            placeholder="0"
            :min="0"
            required
            class="protein-input bg-transparent border-0 outline-none text-white font-serif text-[22px] py-2 w-[5ch]"
          >
          <span class="text-[13px] text-white/40 pb-2">
            grams
          </span>
        </div>
      </div>

      <!-- Date（第三層：安靜的右側 chip） -->
      <div class="flex items-center justify-between pt-1">
        <span class="text-[12px] text-white/45">When</span>
        <div class="flex gap-1.5">
          <button
            v-for="opt in quickDates"
            :key="opt.value"
            type="button"
            class="px-3 py-1 rounded-full text-[12px] border transition-all duration-200"
            :class="!isCustomDate && form.date === opt.value
              ? 'border-teal/60 text-teal bg-teal/10'
              : 'border-white/8 text-white/55 hover:text-white/80'"
            @click="form.date = opt.value"
          >
            {{ opt.label }}
          </button>
          <button
            type="button"
            class="flex items-center gap-1 px-3 py-1 rounded-full text-[12px] border cursor-pointer transition-all duration-200"
            :class="isCustomDate
              ? 'border-teal/60 text-teal bg-teal/10'
              : 'border-white/8 text-white/55 hover:text-white/80'"
            @click="openDatePicker($event)"
          >
            <ion-icon
              :icon="calendarOutline"
              class="text-[12px]"
            />
            <span>{{ isCustomDate ? customLabel : 'Other' }}</span>
          </button>
        </div>
      </div>

      <!-- Date popover -->
      <ion-popover
        :is-open="datePopoverOpen"
        :event="datePopoverEvent"
        :show-backdrop="true"
        :dismiss-on-select="false"
        class="date-popover"
        @did-dismiss="datePopoverOpen = false"
      >
        <ion-datetime
          presentation="date"
          :value="form.date"
          color="teal"
          :show-default-buttons="false"
          @ion-change="onDateChange"
        />
      </ion-popover>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="isLoading || !canSubmit"
        class="group relative w-full overflow-hidden rounded-full py-3.5 mt-2 bg-gradient-to-r from-teal to-teal-deep transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:active:scale-100 shadow-[0_10px_28px_-10px_rgba(36,154,174,0.85),inset_0_1px_0_rgba(255,255,255,0.18)]"
      >
        <span
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
          aria-hidden="true"
        />
        <span class="relative z-10 flex-center gap-2 font-serif text-[15px] tracking-wide text-white">
          <template v-if="isLoading">
            <span>Saving…</span>
          </template>
          <template v-else>
            <span>Save</span>
            <ion-icon
              :icon="arrowForwardOutline"
              class="text-[14px]"
            />
          </template>
        </span>
      </button>

      <transition name="fade">
        <p
          v-if="errorMsg"
          class="text-[#f87171] text-[12px] text-center m-0"
        >
          {{ errorMsg }}
        </p>
      </transition>
    </form>
  </ion-content>
</template>

<script
  setup
  lang="ts"
>
import {
  IonContent,
  IonDatetime,
  IonIcon,
  IonPopover,
} from '@ionic/vue'
import to from 'await-to-js'
import dayjs from 'dayjs'
import { arrowForwardOutline, calendarOutline, closeOutline } from 'ionicons/icons'
import { computed, onMounted, ref } from 'vue'
import { createItem } from '@/api/item'

interface Props {
  onDismiss?: () => void
}
const props = withDefaults(defineProps<Props>(), {})

const today = dayjs().format('YYYY-MM-DD')
const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

const quickDates = [
  { label: 'Today', value: today },
  { label: 'Yesterday', value: yesterday },
]

const form = ref({
  name: '',
  protein: null as number | null,
  date: today,
})

const isLoading = ref(false)
const errorMsg = ref('')
const foodInput = ref<HTMLInputElement | null>(null)

const datePopoverOpen = ref(false)
const datePopoverEvent = ref<Event | undefined>()

function openDatePicker(e: Event) {
  datePopoverEvent.value = e
  datePopoverOpen.value = true
}

function onDateChange(e: CustomEvent) {
  const value = e.detail?.value as string | undefined
  if (!value) return
  form.value.date = dayjs(value).format('YYYY-MM-DD')
  datePopoverOpen.value = false
}

const isCustomDate = computed(() =>
  Boolean(form.value.date) && form.value.date !== today && form.value.date !== yesterday,
)

const customLabel = computed(() =>
  form.value.date ? dayjs(form.value.date).format('MMM D') : 'Other',
)

const canSubmit = computed(() =>
  Boolean(form.value.name && form.value.protein !== null && form.value.date),
)

onMounted(() => {
  // 等 Ionic modal 動畫結束後再聚焦，引導使用者從 Food 開始
  setTimeout(() => foodInput.value?.focus(), 380)
})

async function handleSubmit() {
  if (!canSubmit.value) return

  errorMsg.value = ''
  isLoading.value = true

  const [err] = await to(
    createItem({
      name: form.value.name,
      protein: form.value.protein!,
      date: form.value.date,
    }),
  )

  isLoading.value = false

  if (err) {
    errorMsg.value = 'Failed to add record. Please try again.'
    return
  }

  form.value.name = ''
  form.value.protein = null
  form.value.date = today
  props.onDismiss?.()
}
</script>

<style
  lang="scss"
  scoped
>
.custom-content {
  --background: #0b0d0e;
}

// 移除 number input 的上下箭頭
.protein-input {
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
  appearance: textfield;

  &::placeholder {
    color: rgba(255, 255, 255, 0.22);
  }
}

.date-popover {
  --width: 320px;
  --background: #15191b;
  --box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.6);

  ion-datetime {
    --background: #15191b;
    --background-rgb: 21, 25, 27;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
