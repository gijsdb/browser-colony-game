<template>
  <div class="game-container">
    <button
      @click="handleExitGame"
      class="border-2 border-gray-400 bg-[#181818] absolute p-2 right-2 top-2 font-xl text-gray-400"
    >
      Exit
    </button>
    <GameUI v-show="gameStoreRef.game.value.running"></GameUI>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import GameUI from '@/components/GameUI.vue'

const gameStore = useGameStore()
let gameStoreRef = storeToRefs(gameStore)
const { storeEndGame } = gameStore

const handleExitGame = () => {
  storeEndGame()
}
</script>
