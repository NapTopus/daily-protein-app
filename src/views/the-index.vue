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
          <ion-title size="large">今日的蛋白質</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- 內容 -->
    </ion-content>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
</script>
