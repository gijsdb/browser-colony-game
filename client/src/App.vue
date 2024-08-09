<template>
  <div>
    <MainMenu v-if="!uiStoreRef.ui.value.gameRunning" />
    <GameContainer v-else />
  </div>
</template>

<script setup lang="ts">
import GameContainer from './components/GameContainer.vue'
import MainMenu from './components/MainMenu.vue'
import { storeToRefs } from 'pinia'
import { useUIStore } from './stores/ui'

const uiStore = useUIStore()
let uiStoreRef = storeToRefs(uiStore)
</script>
