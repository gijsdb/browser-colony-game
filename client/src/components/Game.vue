<template>
    <div
        ref="gameContainer"
        class="game-container"
    >
        <GameUI></GameUI>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GameUI from '@/components/GameUI.vue'
import GameController from '@/game/GameController'

const gameContainer = ref(null)

onMounted(() => {
    if (gameContainer.value) {
        let gc = new GameController(gameContainer.value.id)
    }
})
</script>
