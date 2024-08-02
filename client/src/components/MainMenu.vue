<template>
    <div class="w-screen h-screen bg-black text-white flex items-center justify-center">
        <div class="flex flex-col gap-y-8">
            <h1 class="text-3xl">Main menu</h1>
            <button @click="handleNewGame">New game</button>
        </div>
    </div>
</template>


<script setup>
import { useGameStore } from "@/stores/game.js";

const gameStore = useGameStore();
const { storeStartGame } = gameStore

const handleNewGame = () => {
    storeStartGame()
}
</script>