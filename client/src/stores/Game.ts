import { defineStore } from 'pinia'
import { ToRefs } from 'vue'
import Resource from '../game/entities/resources/Resource'
import Colonist from '../game/entities/Colonist'
import { Terrain } from '../game/mapgen/TerrainGenerator'
import Tree from '../game/entities/resources/Tree'
import { Job } from '../game/entities/Job'
import MapScene from '../game/scenes/MapScene'

export type GameStoreType = ReturnType<typeof useGameStore>
export type GameStoreRefsType = ToRefs<GameState>
export type GameStoreJob = {
  location: number[]
  resourceId: number
}

export type Inventory = {
  wood: number
}

export type GameState = {
  game: {
    jobs: Job[]
    resources: Resource[]
    colonists: Colonist[]
    map: {
      tileMap: Phaser.Tilemaps.Tilemap | undefined
      tileSize: number
      mapWidthTiles: number
      mapHeightTiles: number
      terrainLayout: Terrain
    }
    currentScene: MapScene | undefined
    inventory: Inventory
  }
}

export const useGameStore = defineStore('GameStore', {
  state: (): GameState => {
    return {
      game: {
        jobs: [],
        resources: [],
        colonists: [],
        map: {
          tileMap: undefined,
          tileSize: 32,
          terrainLayout: [],
          mapWidthTiles: 100,
          mapHeightTiles: 100
        },
        currentScene: undefined,
        inventory: {
          wood: 0
        }
      }
    }
  },
  getters: {},
  actions: {
    storeSetMap(map: Phaser.Tilemaps.Tilemap | undefined) {
      if (!this.game.map.tileMap) {
        this.game.map.tileMap = map
      }
    },
    storeSetTerrainLayout(terrain: Terrain) {
      this.game.map.terrainLayout = terrain
    },
    storeSetCurrentScene(scene: MapScene) {
      this.game.currentScene = scene
    },
    storeAddResource(resource: Resource) {
      resource.id = this.game.resources.length
      this.game.resources.push(resource)
    },
    storeAddColonist(colonist: Colonist): Colonist {
      this.game.colonists.push(colonist)
      return colonist
    },
    storeUpdateColonist(colonistToUpdate: Colonist) {
      this.game.colonists.forEach((colonist) => {
        if (colonist.id === colonistToUpdate.id) {
          colonist = colonistToUpdate
        }
      })
    },
    storeSetJobs(jobs: Job[]) {
      this.game.jobs = jobs
    },
    storeSetResourceToHarvest(tileX: number, tileY: number): Resource | null {
      for (const resource of this.game.resources) {
        if (resource.x === tileX && resource.y === tileY) {
          if (!resource.toHarvest) {
            resource.toHarvest = true
            return resource
          }
          break
        }
      }
      return null
    },
    storeAddResourceToInventory(type: string, typeValue: number) {
      // temp
      if (type === 'wood') {
        this.game.inventory.wood = this.game.inventory.wood + typeValue
      }
    },
    storeReset() {
      this.game = {
        jobs: [],
        resources: [],
        colonists: [],
        map: {
          tileMap: undefined,
          tileSize: 32,
          terrainLayout: [],
          mapWidthTiles: 100,
          mapHeightTiles: 100
        },
        currentScene: undefined,
        inventory: {
          wood: 0
        }
      }
    }
  }
})
