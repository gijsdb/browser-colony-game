<template>
  <div>
    <MainMenu
      v-if="!gameStarted"
      @start-game="startGame"
    />
    <Game v-else />
  </div>
</template>

<script setup>
import Game from './components/Game.vue'

import MainMenu from './components/MainMenu.vue'
import { ref } from 'vue'

let gameStarted = ref(false)

const startGame = () => {
  gameStarted.value = true
}
</script>

<style>
body {
  margin: 0;
}
</style>