<template>
    <div
        ref="gameContainer"
        class="game-container"
    ></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createPhaserGame } from './game';

const gameContainer = ref(null);

onMounted(() => {
    console.log("MOUNTED GAME")
    if (gameContainer.value) {
        createPhaserGame(gameContainer.value.id);
    }
});
</script>

<style scoped></style>
