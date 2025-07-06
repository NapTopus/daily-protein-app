<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button
          tab="index"
          href="/tabs/index"
          class="[--color-selected:theme(colors.primary)]"
        >
          <ion-icon
            aria-hidden="true"
            :icon="home"
          />
          <ion-label>首頁</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="history"
          href="/tabs/history"
          class="[--color-selected:theme(colors.primary)]"
        >
          <ion-icon
            aria-hidden="true"
            :icon="calendar"
          />
          <ion-label>歷史</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="analysis"
          href="/tabs/analysis"
          class="[--color-selected:theme(colors.primary)]"
        >
          <ion-icon
            aria-hidden="true"
            :icon="barChart"
          />
          <ion-label>分析</ion-label>
        </ion-tab-button>

        <ion-tab-button
          tab="settings"
          href="/tabs/settings"
          class="[--color-selected:theme(colors.primary)]"
        >
          <ion-icon
            aria-hidden="true"
            :icon="settings"
          />
          <ion-label>設定</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script
  setup
  lang="ts"
>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home, calendar, barChart, settings } from 'ionicons/icons';
</script>
