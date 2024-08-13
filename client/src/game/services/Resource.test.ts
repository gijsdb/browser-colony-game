import eventBusMock from '../../../__mocks__/eventBusMock'
import phaserMock from '../../../__mocks__/phaserMock'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { ResourceService } from './Resource'
import { useGameStore } from '../../stores/Game'
import Phaser from 'phaser'
import phaserSceneMock from '../../../__mocks__/phaserSceneMock'
import phaserTilemapMock from '../../../__mocks__/phaserTilemapMock'
import { eventBus } from '../../eventBus'

global.Phaser = Phaser

jest.mock('phaser', () => phaserMock)
jest.mock('../../eventBus', () => eventBusMock)

describe('resource service', () => {
  let rs: ResourceService
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

    rs = new ResourceService()
  })

  it('listens for harvests', () => {
    rs.listenForHarvests()

    expect(eventBus.value.on).toHaveBeenCalledWith('resource-harvested', expect.any(Function))
  })
})
