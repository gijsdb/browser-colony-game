import { GameStoreRefsType, GameStoreType, useGameStore } from '@/stores/game'
import { TILE_VARIANTS } from '../mapgen/TileVariants'
import { storeToRefs } from 'pinia'
import Mushroom from '../entities/resources/mushroom'
import Tree from '../entities/resources/tree'

export interface ResourceServiceI {
  spawnResources(): void
}

export class ResourceService implements ResourceServiceI {
  private store: GameStoreType
  private storeRefs: GameStoreRefsType

  constructor() {
    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
  }

  // Initializes the entities for the resources placed around the terrain
  spawnResources() {
    const { storeAddResource } = this.store

    const terrain = this.storeRefs.game.value.map.terrainLayout

    const width = this.storeRefs.game.value.map.terrainLayout[0].length
    const height = this.storeRefs.game.value.map.terrainLayout.length

    for (let y = 1; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (terrain[y][x] === TILE_VARIANTS.RESOURCE_LAYER.MUSHROOM.TILE_MAP_INDEX) {
          storeAddResource(new Mushroom(x, y))
        } else if (terrain[y][x] === TILE_VARIANTS.RESOURCE_LAYER.TREE_TRUNK.TILE_MAP_INDEX) {
          storeAddResource(new Tree(x, y))
        } else if (terrain[y][x] === TILE_VARIANTS.RESOURCE_LAYER.BERRIES.TILE_MAP_INDEX) {
        }
      }
    }
  }
}
