<template>
  <div>
    <MainMenu v-if="!gameStoreRef.game.value.running" />
    <GameContainer v-else />
  </div>
</template>

<script setup lang="ts">
import GameContainer from './components/GameContainer.vue'
import MainMenu from './components/MainMenu.vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from './stores/game'

const gameStore = useGameStore()
let gameStoreRef = storeToRefs(gameStore)
</script>
