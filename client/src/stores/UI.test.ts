import { setActivePinia, createPinia } from 'pinia'
import { useUIStore } from './UI'
import GameController from '../game/controllers/GameController'

// jest.mock('../game/controllers/GameController', () => {
//   return jest.fn().mockImplementation(() => ({
//     endGame: jest.fn()
//   }))
// })

describe('UI Store', () => {
  let uiStore: ReturnType<typeof useUIStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    uiStore = useUIStore()
  })

  it('should initialize with correct default state', () => {
    expect(uiStore.ui.gameController).toBeNull()
    expect(uiStore.ui.gameRunning).toBe(false)
  })

  it('should start the game correctly', () => {
    const colonistAmount = 5
    uiStore.storeStartGame(colonistAmount)

    expect(uiStore.ui.gameController).toBeInstanceOf(GameController)
    // expect(GameController).toHaveBeenCalledWith(colonistAmount)
    expect(uiStore.ui.gameRunning).toBe(true)
  })

  it('should end the game correctly', () => {
    uiStore.storeStartGame(5)
    uiStore.storeEndGame()

    expect(uiStore.ui.gameRunning).toBe(false)
    expect(uiStore.ui.gameController).toBeNull()
  })
})
