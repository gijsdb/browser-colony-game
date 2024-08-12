import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { ColonistService } from './Colonist'
import { useGameStore } from '../../stores/Game'
import Phaser, { GameObjects } from 'phaser'

global.Phaser = Phaser

jest.mock('phaser', () => ({
  Game: jest.fn(),
  GameObjects: {
    Sprite: jest.fn().mockImplementation(() => ({
      setOrigin: jest.fn().mockReturnThis(),
      setDepth: jest.fn().mockReturnThis(),
      add: jest.fn()
    })),
    Text: jest.fn().mockImplementation(() => ({
      setOrigin: jest.fn().mockReturnThis()
    })),
    Container: jest.fn().mockImplementation(() => ({
      add: jest.fn()
    }))
  },
  Scene: jest.fn(),
  Math: {
    Between: jest.fn().mockReturnValue(50),
    Distance: {
      Between: jest.fn().mockReturnValue(10)
    }
  }
}))

jest.mock('../../eventBus', () => ({
  eventBus: {
    value: {
      on: jest.fn(),
      emit: jest.fn()
    }
  }
}))

jest.mock('../mapgen/TileVariants', () => ({
  TILE_VARIANTS: {
    GROUND_LAYER: {
      GRASS: {
        TILE_MAP_INDEX: 0
      }
    }
  }
}))

describe('testing colonist service', () => {
  let cs: ColonistService
  let store: ReturnType<typeof useGameStore>

  beforeEach(async () => {
    const mockTilemap = {
      getTileAt: jest.fn().mockReturnValue({
        index: 0 // Mocked tile index for GRASS
      })
    }

    const mockScene = {
      add: {
        sprite: jest.fn().mockReturnValue({
          setOrigin: jest.fn().mockReturnThis(),
          setDepth: jest.fn().mockReturnThis(),
          add: jest.fn()
        }),
        text: jest.fn().mockReturnValue({
          setOrigin: jest.fn().mockReturnThis()
        }),
        container: jest.fn().mockReturnValue({
          add: jest.fn()
        })
      },
      anims: {
        create: jest.fn(),
        generateFrameNumbers: jest.fn().mockReturnValue([])
      }
    }

    const pinia = createTestingPinia({
      initialState: {
        game: {
          resources: [],
          colonists: [],
          map: {
            tileMap: mockTilemap,
            tileSize: 32,
            terrainLayout: [
              [1, 2],
              [3, 4]
            ],
            mapWidthTiles: 100,
            mapHeightTiles: 100
          },
          currentScene: mockScene
        }
      },
      stubActions: false
    })
    setActivePinia(pinia)
    store = useGameStore()
    //initial state not being set for some reason so this fixes it
    store.$patch({
      game: {
        resources: [],
        colonists: [],
        map: {
          tileMap: mockTilemap,
          tileSize: 32,
          terrainLayout: [],
          mapWidthTiles: 100,
          mapHeightTiles: 100
        },
        currentScene: mockScene
      }
    })

    jest.spyOn(store, 'storeAddColonist')

    cs = new ColonistService(3)
  })

  it('spawns colonists', () => {
    cs.spawnColonist(3)

    expect(store.storeAddColonist).toHaveBeenCalledTimes(3)
    expect(store.game.colonists.length).toBe(3)
  })

  // it('creates animations', () => {
  //   cs.createAnimations()
  //   expect(mockScene.anims.create).toHaveBeenCalledTimes(6)
  // })
})
