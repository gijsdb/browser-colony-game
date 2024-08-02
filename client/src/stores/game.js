import { defineStore } from 'pinia'
import GameController from '@/game/GameController'

export const useGameStore = defineStore('GameStore', {
    state: () => {
        return {
            game: {
                controller: null,
                running: false,
            }
        }
    },
    getters: {

    },
    actions: {
        storeStartGame(gameContainer) {
            this.game.controller = new GameController(gameContainer)
            this.game.running = true
        },
        storeEndGame() {
            this.game.controller.endGame()
            this.game.running = false
            this.game.controller = null
        },
    }
})
