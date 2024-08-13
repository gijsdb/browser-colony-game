import Phaser from 'phaser'
import { setActivePinia, createPinia } from 'pinia'
import { GameStoreJob, useGameStore } from './Game'
import Resource from '../game/entities/resources/Resource'
import Colonist from '../game/entities/Colonist'
import Tree from '../game/entities/resources/Tree'

global.Phaser = Phaser

describe('Game store', () => {
  let store: ReturnType<typeof useGameStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameStore()
  })

  it('should store the tilemap correctly', () => {
    const mockTilemap = {} as Phaser.Tilemaps.Tilemap

    store.storeSetMap(mockTilemap)

    expect(store.game.map.tileMap).toStrictEqual(mockTilemap)
  })

  it('should store the terrain layout correctly', () => {
    const mockTerrain = [
      [1, 2],
      [3, 4]
    ]

    store.storeSetTerrainLayout(mockTerrain)

    expect(store.game.map.terrainLayout).toStrictEqual(mockTerrain)
  })

  it('should store the current scene correctly', () => {
    const mockScene = {} as Phaser.Scene
    store.storeSetCurrentScene(mockScene)

    expect(store.game.currentScene).toStrictEqual(mockScene)
  })

  it('should add a resource and assign an ID correctly', () => {
    const mockResource = { x: 10, y: 20 } as Resource
    store.storeAddResource(mockResource)

    expect(store.game.resources.length).toBe(1)
    expect(store.game.resources[0]).toStrictEqual(mockResource)
    expect(store.game.resources[0].id).toBe(0)

    const mockResourceTwo = { x: 11, y: 21 } as Resource
    store.storeAddResource(mockResourceTwo)
    expect(store.game.resources.length).toBe(2)
    expect(store.game.resources[1]).toStrictEqual(mockResourceTwo)
    expect(store.game.resources[1].id).toBe(1)
  })

  it('should add a colonist correctly', () => {
    const mockColonist = {} as Colonist
    store.storeAddColonist(mockColonist)

    expect(store.game.colonists.length).toBe(1)
    expect(store.game.colonists[0]).toStrictEqual(mockColonist)
  })

  it('should set a resource to harvest correctly', () => {
    const mockResource = { x: 5, y: 10, toHarvest: false } as Resource
    store.storeAddResource(mockResource)

    const result: GameStoreJob | null = store.storeSetResourceToHarvest(5, 10)

    expect(result).not.toBeNull()
    expect(result).toStrictEqual({ location: [5, 10], resourceId: 0 })
    expect(store.game.resources[0].toHarvest).toBe(true)
  })

  it('should reset the store correctly', () => {
    // Set some state
    store.storeSetMap({} as Phaser.Tilemaps.Tilemap)
    store.storeAddResource({ x: 10, y: 20 } as Resource)
    store.storeAddColonist({} as Colonist)

    // Reset the store
    store.storeReset()

    // Verify the state has been reset
    expect(store.game.map.tileMap).toBeUndefined()
    expect(store.game.resources).toHaveLength(0)
    expect(store.game.colonists).toHaveLength(0)
    expect(store.game.currentScene).toBeUndefined()
  })

  it('should add resource and value to inventory', () => {
    let resource = new Tree(0, 0)
    let value = resource.harvest()
    store.storeAddResourceToInventory(resource, value)

    expect(store.game.inventory.wood).toEqual(value)
  })
})
