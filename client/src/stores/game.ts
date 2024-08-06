import { defineStore } from 'pinia'
import GameController from '@/game/controllers/GameController'

type State = {
    game: {
        controller: GameController | null
        running: boolean
    }
}

export const useGameStore = defineStore('GameStore', {
    state: (): State => {
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
        storeStartGame(colonistAmount: number) {
            this.game.controller = new GameController(colonistAmount)
            this.game.running = true
        },
        storeEndGame() {
            if(this.game.controller) {
                this.game.controller.endGame()
            }

            this.game.running = false
            this.game.controller = null
        },
    }
})
