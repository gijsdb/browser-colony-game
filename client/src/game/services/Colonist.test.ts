import eventBusMock from '../../../__mocks__/eventBusMock'
import phaserMock from '../../../__mocks__/phaserMock'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { ColonistService } from './Colonist'
import { useGameStore } from '../../stores/Game'
import phaserSceneMock from '../../../__mocks__/phaserSceneMock'
import phaserTilemapMock from '../../../__mocks__/phaserTilemapMock'
import Phaser from 'phaser'
import { eventBus } from '../../eventBus'

global.Phaser = Phaser
jest.mock('phaser', () => phaserMock)
jest.mock('../../eventBus', () => eventBusMock)

jest.mock('../mapgen/TileVariants', () => ({
  TILE_VARIANTS: {
    GROUND_LAYER: {
      GRASS: {
        TILE_MAP_INDEX: 0
      }
    }
  }
}))

describe('colonist service', () => {
  let cs: ColonistService
  let store: ReturnType<typeof useGameStore>
  let mockScene: any
  let mockTilemap: any

  beforeEach(async () => {
    mockTilemap = phaserTilemapMock

    mockScene = phaserSceneMock

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

  it('creates animations', () => {
    cs.createAnimations()
    expect(mockScene.anims.create).toHaveBeenCalledTimes(6)
  })

  it('listens for orders', () => {
    cs.createNewJob()
    expect(eventBus.value.on).toHaveBeenCalledWith(
      'resource-marked-for-harvest',
      expect.any(Function)
    )
  })

  it('performs a job', () => {
    jest.useFakeTimers()
    const mockColonist = {
      moveColonistTo: jest.fn((location, callback) => callback()),
      occupied: true
    }
    jest.spyOn(cs, 'getClosestColonist').mockReturnValue(mockColonist as any)

    const job = { location: [10, 20], inProgress: false, type: 'harvest' as const, resourceId: 1 }
    cs.performJob(job)

    expect(job.inProgress).toBe(true)
    expect(mockColonist.moveColonistTo).toHaveBeenCalled()

    jest.runAllTimers()

    expect(eventBus.value.emit).toHaveBeenCalledWith('resource-harvested', { resourceId: 1 })
    expect(mockColonist.occupied).toBe(false)
  })

  // it('gets the closest colonist', () => {
  //   const mockColonists = [
  //     { x: 0, y: 0, occupied: false },
  //     { x: 5, y: 5, occupied: false },
  //     { x: 10, y: 10, occupied: false }
  //   ]
  //   store.$patch({ game: { colonists: mockColonists } })

  //   const closestColonist = cs.getClosestColonist([3, 3])
  //   expect(closestColonist).toEqual(mockColonists[1])
  // })

  // it('destroys the service', () => {
  //   jest.useFakeTimers()

  //   cs.startJobProcessing()
  //   cs.destroy()
  //   expect(clearInterval).toHaveBeenCalled()
  // })
})
