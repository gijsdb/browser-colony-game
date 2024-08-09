import { defineStore } from 'pinia'
import GameController from '@/game/controllers/GameController'

type UIState = {
  ui: {
    gameController: GameController | null
    gameRunning: boolean
  }
}

export const useUIStore = defineStore('UIStore', {
  state: (): UIState => {
    return {
      ui: {
        gameController: null,
        gameRunning: false
      }
    }
  },
  getters: {},
  actions: {
    storeStartGame(colonistAmount: number) {
      this.ui.gameController = new GameController(colonistAmount)
      this.ui.gameRunning = true
    },
    storeEndGame() {
      this.ui.gameController!.endGame()

      this.ui.gameRunning = false
      this.ui.gameController = null
    }
  }
})
