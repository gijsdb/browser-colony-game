import { defineStore } from 'pinia'
import { ToRefs } from 'vue'
import Resource from '@/game/entities/resources/resource'
import Colonist from '@/game/entities/colonist'
import { Terrain } from '@/game/controllers/TerrainController'

export type GameStoreType = ReturnType<typeof useGameStore>
export type GameStoreRefsType = ToRefs<GameState>

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
        currentScene: undefined
      }
    }
  },
  getters: {},
  actions: {
    storeSetMap(map: Phaser.Tilemaps.Tilemap) {
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
    storeSetResources() {},
    storeSetColonists() {}
  }
})
