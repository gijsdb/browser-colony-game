<template>
  <div class="w-screen h-screen bg-black text-white flex items-center justify-center">
    <div v-show="!creatingNewGame" class="flex flex-col gap-y-8">
      <h1 class="text-3xl">Main menu</h1>
      <button @click="handleNewGame">New game</button>
    </div>
    <div class="flex flex-col gap-y-4 text-center" v-show="creatingNewGame">
      <label>Number of colonists</label>
      <input type="number" v-model="colonistAmount" class="text-black" />
      <button @click="handleStartGame">Start</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '../stores/UI'

const uiStore = useUIStore()
const { storeStartGame } = uiStore

let creatingNewGame = ref(false)
let colonistAmount = ref(5)

const handleNewGame = () => {
  creatingNewGame.value = true
}

const handleStartGame = () => {
  storeStartGame(colonistAmount.value)
  creatingNewGame.value = false
}
</script>
