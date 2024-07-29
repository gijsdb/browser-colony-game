<template>
    <div
        ref="gameContainer"
        class="game-container"
    >
        <UI class="ui-component"></UI>
    </div>
</template>

<script setup>
import UI from './UI.vue'
import { ref, onMounted } from 'vue'
import GameController from './../game/GameController'
import UIController from '@/game/UIController'

const gameContainer = ref(null)

onMounted(() => {
    if (gameContainer.value) {
        let gc = new GameController(gameContainer.value.id)
        new UIController(gc)
    }

    gameContainer.value.addEventListener(
        'wheel',
        (event) => {
            // Allow scrolling only if the event target is not part of the UI
            if (!event.target.closest('.ui-component')) {
                event.stopPropagation()
            }
        },
        true
    ) // ensure Phaser gets the event first
})
</script>
