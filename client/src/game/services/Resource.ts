import { GameStoreRefsType, GameStoreType, useGameStore } from '../../stores/Game'
import { TILE_VARIANTS } from '../mapgen/TileVariants'
import { storeToRefs } from 'pinia'
import Mushroom from '../entities/resources/Mushroom'
import Tree from '../entities/resources/Tree'
import { eventBus } from '../../eventBus'
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
    const { storeAddResourceToInventory } = this.store
    eventBus.value.on('resource-harvested', (data) => {
      const harvestedResourceId = data as { resourceId: number }
      console.log(harvestedResourceId)
      this.storeRefs.game.value.resources.map((resource) => {
        if (resource.id === harvestedResourceId.resourceId) {
          let value = resource.harvest()
          this.removeHarvestedResourceFromTerrain(resource)
          storeAddResourceToInventory(resource, value)
        }
      })
    })
  }

  //todo: if tree remove tree top tile also
  removeHarvestedResourceFromTerrain(resource: Resource) {
    const terrain = this.storeRefs.game.value.map.terrainLayout
    const { tileMap } = this.storeRefs.game.value.map

    terrain[resource.y][resource.x] = TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX

    tileMap!.removeTileAt(resource.x, resource.y, false, false, 'Resource')

    // not perfect, this assumes the extra tile for a tree is at y-1.
    if (resource.tilesheetId.length > 1) {
      tileMap!.removeTileAt(resource.x, resource.y - 1, false, false, 'Resource')
    }
    tileMap!.putTileAt(
      TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX,
      resource.x,
      resource.y,
      false,
      'Ground'
    )
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
