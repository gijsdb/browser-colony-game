import { defineStore } from 'pinia'
import { ToRefs } from 'vue'
import Resource from '../game/entities/resources/Resource'
import Colonist from '../game/entities/Colonist'
import { Terrain } from '../game/mapgen/TerrainGenerator'
import Tree from '../game/entities/resources/Tree'

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
    resources: Resource[]
    colonists: Colonist[]
    map: {
      tileMap: Phaser.Tilemaps.Tilemap | undefined
      tileSize: number
      mapWidthTiles: number
      mapHeightTiles: number
      terrainLayout: Terrain
    }
    currentScene: Phaser.Scene | undefined
    inventory: Inventory
  }
}

export const useGameStore = defineStore('GameStore', {
  state: (): GameState => {
    return {
      game: {
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
    storeSetCurrentScene(scene: Phaser.Scene) {
      this.game.currentScene = scene
    },
    storeAddResource(resource: Resource) {
      resource.id = this.game.resources.length
      this.game.resources.push(resource)
    },
    storeAddColonist(colonist: Colonist) {
      this.game.colonists.push(colonist)
    },
    storeSetResourceToHarvest(tileX: number, tileY: number): GameStoreJob | null {
      for (const resource of this.game.resources) {
        if (resource.x === tileX && resource.y === tileY) {
          if (!resource.toHarvest) {
            resource.toHarvest = true
            return {
              location: [tileX, tileY],
              resourceId: resource.id!
            }
          }
          break
        }
      }
      return null
    },
    storeAddResourceToInventory(resource: Resource, value: number) {
      switch (true) {
        case resource instanceof Tree:
          this.game.inventory.wood = this.game.inventory.wood + value
      }
    },
    storeReset() {
      this.game = {
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
