import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
// import { ColonistService } from './colonist'
import { useGameStore } from '../../stores/game'
import Phaser from 'phaser'

global.Phaser = Phaser

jest.mock('phaser', () => ({
  Game: jest.fn(),
  Scene: jest.fn(),
  Math: {
    Between: jest.fn().mockReturnValueOnce(50).mockReturnValueOnce(50),
    Distance: {
      Between: jest.fn()
    }
  }
}))

describe('testing colonist service', () => {
  let cs: any
  beforeAll(async () => {
    let testPinia = createTestingPinia({
      initialState: {
        game: {
          map: {
            tileMap: {
              getTileAt: jest.fn().mockReturnValue({
                index: 0 // Mocked tile index
              })
            },
            tileSize: 32,
            terrainLayout: [],
            mapWidthTiles: 100,
            mapHeightTiles: 100
          },
          resources: [],
          colonists: [],
          currentScene: {} // Mock current scene to avoid undefined errors
        }
      }
    })
    setActivePinia(testPinia)
    const { ColonistService } = await import('./Colonist')
    //const store = useGameStore()
    cs = new ColonistService(3)
  })

  it('spawns colonists', () => {
    const store = useGameStore()
    console.log('Initial Game Store State:', store.$state)

    //console.log('STORE', store.game.map.tileMap!.getTileAt(1, 1, true, 'Ground'))
    cs?.spawnColonist(3)

    expect(store.game.colonists.length).toBe(3)
  })

  //   test('empty string should result in zero', () => {
  //     expect(add('')).toBe(0)
  //   })
})
