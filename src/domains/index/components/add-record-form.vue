<template>
  <!-- Ionic Modal 結構 -->
  <ion-header>
    <ion-toolbar>
      <ion-title>Add Protein Item</ion-title>
      <ion-buttons slot="end">
        <ion-button
          @click="props.onDismiss?.()"
          style="--color: #9ecfda"
        >
          <ion-icon :icon="closeOutline" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col gap-5 pt-2"
    >
      <!-- 食物名稱 -->
      <ion-item
        lines="full"
        class="custom-item"
      >
        <ion-label
          position="stacked"
          class="custom-label"
        >
          Food Name
        </ion-label>
        <ion-input
          v-model="form.name"
          type="text"
          placeholder="e.g. egg"
          required
          class="custom-input"
        />
      </ion-item>

      <!-- 蛋白質 (g) -->
      <ion-item
        lines="full"
        class="custom-item"
      >
        <ion-label
          position="stacked"
          class="custom-label"
        >
          Protein (g)
        </ion-label>
        <ion-input
          v-model="form.protein"
          type="number"
          placeholder="e.g. 7"
          :min="0"
          required
          class="custom-input"
        />
      </ion-item>

      <!-- 日期 -->
      <ion-item
        lines="full"
        class="custom-item"
      >
        <ion-label
          position="stacked"
          class="custom-label"
        >
          Date
        </ion-label>
        <ion-input
          v-model="form.date"
          type="date"
          required
          class="custom-input"
        />
      </ion-item>

      <!-- 送出按鈕 -->
      <ion-button
        type="submit"
        expand="block"
        :disabled="isLoading"
        class="submit-btn mt-2"
      >
        <span v-if="isLoading">Adding…</span>
        <span v-else>Add Item</span>
      </ion-button>

      <!-- 成功 / 錯誤提示 -->
      <transition name="fade">
        <p
          v-if="errorMsg"
          class="text-[#f87171] text-[13px] text-center m-0"
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
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import to from 'await-to-js'
import { closeOutline } from 'ionicons/icons'
import { ref } from 'vue'
import { createItem } from '@/api/item'
import dayjs from 'dayjs'

interface Props {
  onDismiss?: () => void
}
const props = withDefaults(defineProps<Props>(), {})

const form = ref({
  name: '',
  protein: null as number | null,
  date: dayjs().format('YYYY-MM-DD'),
})

const isLoading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  if (!form.value.name || form.value.protein === null || !form.value.date) return

  errorMsg.value = ''
  isLoading.value = true

  const [err] = await to(
    createItem({
      name: form.value.name,
      protein: form.value.protein,
      date: form.value.date,
    }),
  )

  isLoading.value = false

  if (err) {
    errorMsg.value = 'Failed to add record. Please try again.'
    return
  }

  // 新增成功 → 重置表單並關閉 Modal
  form.value.name = ''
  form.value.protein = null
  form.value.date = dayjs().format('YYYY-MM-DD')
  props.onDismiss?.()
}
</script>

<style
  lang="scss"
  scoped
>
.custom-item {
  --background: rgba(255, 255, 255, 0.04);
  --border-color: #3b3b3b;
  --highlight-color-focused: #249aae;
  --padding-start: 14px;
  border-radius: 10px;
  margin-bottom: 2px;
}

.custom-label {
  color: #9ecfda !important;
  font-size: 11px !important;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.custom-input {
  --color: #fff;
  --placeholder-color: rgba(255, 255, 255, 0.25);
  font-size: 15px;
}

.submit-btn {
  --background: linear-gradient(135deg, #249aae 0%, #1a7a8f 100%);
  --background-activated: #1a7a8f;
  --border-radius: 10px;
  --box-shadow: 0 0 14px rgba(36, 154, 174, 0.5);
  font-weight: 600;
  letter-spacing: 0.05em;
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
