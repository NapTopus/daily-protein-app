<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar
        slot="bottom"
        class="custom-tab-bar"
      >
        <ion-tab-button
          tab="index"
          href="/tabs/index"
        >
          <ion-icon
            aria-hidden="true"
            :icon="home"
          />
        </ion-tab-button>

        <ion-tab-button
          tab="history"
          href="/tabs/history"
        >
          <ion-icon
            aria-hidden="true"
            :icon="calendar"
          />
        </ion-tab-button>

        <ion-tab-button
          tab="analysis"
          href="/tabs/analysis"
        >
          <ion-icon
            aria-hidden="true"
            :icon="barChart"
          />
        </ion-tab-button>

        <ion-tab-button
          tab="settings"
          href="/tabs/settings"
        >
          <ion-icon
            aria-hidden="true"
            :icon="settings"
          />
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
<style
  lang="scss"
  scoped
>
.custom-tab-bar {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  margin: 0 auto;
  border-radius: 70px;
  background: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(10px);
  padding: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  height: 40px;
}

.custom-tab-bar ion-tab-button {
  --color: #aaa;
  --color-selected: white;
  --background: transparent;
  border-radius: 70px;
  transition: background 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.custom-tab-bar ion-tab-button.tab-selected {
  background: rgba(255, 255, 255, 0.1);
}

.custom-tab-bar ion-icon {
  font-size: 22px;
}
</style>
