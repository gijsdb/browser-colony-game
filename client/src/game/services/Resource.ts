import { GameStoreRefsType, GameStoreType, useGameStore } from '@/stores/game'
import { TILE_VARIANTS } from '../mapgen/TileVariants'
import { storeToRefs } from 'pinia'
import Mushroom from '../entities/resources/Mushroom'
import Tree from '../entities/resources/Tree'
import { eventBus } from '@/eventBus'
import Resource from '../entities/resources/Resource'

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

  listenForHarvests() {
    eventBus.value.on('resource-harvested', (data) => {
      const harvestedResourceId = data as { resourceId: number }
      console.log(harvestedResourceId)
      this.storeRefs.game.value.resources.map((resource) => {
        if (resource.id === harvestedResourceId.resourceId) {
          resource.harvest()
        }
        this.removeHarvestedResourceFromTerrain(resource)
      })
    })
  }

  removeHarvestedResourceFromTerrain(resource: Resource) {
    const terrain = this.storeRefs.game.value.map.terrainLayout
    const { tileMap, tileSize } = this.storeRefs.game.value.map

    // Get the current tile
    let tile = terrain[resource.y][resource.x]

    // Check if the current tile is one of the resource's tiles
    if (tile === resource.tilesheetId[0] || tile === resource.tilesheetId[1]) {
      // Update the terrain layout to the grass tile
      terrain[resource.y][resource.x] = TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX

      // Remove the resource tile from the map
      tileMap?.removeTileAt(resource.x, resource.y, false, false, 'Resource')

      tileMap?.removeTileAtWorldXY(
        resource.x,
        resource.y,
        true,
        false,
        this.storeRefs.game.value.currentScene?.cameras.main,
        'Resource'
      )
      // Replace the tile with a grass tile in the "Ground" layer
      tileMap?.putTileAt(
        TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX,
        resource.x,
        resource.y,
        false,
        'Ground'
      )
    }
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

    this.listenForHarvests()
  }
}
