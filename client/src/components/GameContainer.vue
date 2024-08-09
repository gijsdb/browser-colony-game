<template>
  <div class="game-container">
    <button
      @click="handleExitGame"
      class="border-2 border-gray-400 bg-[#181818] absolute p-2 right-2 top-2 font-xl text-gray-400"
    >
      Exit
    </button>
    <GameUI v-show="uiStoreRef.ui.value.gameRunning"></GameUI>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/ui'
import GameUI from '@/components/GameUI.vue'

const uiStore = useUIStore()
let uiStoreRef = storeToRefs(uiStore)
const { storeEndGame } = uiStore

const handleExitGame = () => {
  storeEndGame()
}
</script>
