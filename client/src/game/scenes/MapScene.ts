import Phaser from 'phaser'
import tiles from '@/assets/tilesets/forest_tiles_fixed.png'
import { Terrain, TILE_VARIANTS } from '@/game/controllers/TerrainController'
import EntityController from '@/game/controllers/EntityController'
import CameraController from '@/game/controllers/CameraController'
import { isTileIdInObject } from '@/game/util'
import { GameStoreType, GameStoreRefsType, useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

class MapScene extends Phaser.Scene {
  private entityController?: EntityController
  private cameraController?: CameraController
  private store: GameStoreType
  private storeRefs: GameStoreRefsType

  constructor() {
    super({ key: 'MapScene' })
    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
  }

  preload() {
    this.load.image('tiles', tiles)
  }

  initControllers() {
    let data = this.sys.getData()

    this.entityController = data.entityController
    this.cameraController = data.cameraController

    if (!this.entityController || !this.cameraController) {
      throw Error('no controllers provided to scene')
    }
  }

  create() {
    const { storeSetMap } = this.store
    this.initControllers()

    let map = this.make.tilemap({
      tileHeight: this.storeRefs.game.value.map.tileSize,
      width: this.storeRefs.game.value.map.mapWidthTiles,
      height: this.storeRefs.game.value.map.mapHeightTiles
    })

    const tileset = map.addTilesetImage(
      'tileset-name',
      'tiles',
      this.storeRefs.game.value.map.tileSize,
      this.storeRefs.game.value.map.tileSize,
      1,
      2
    )
    if (!tileset) {
      throw Error('failed to load tileset')
    }

    let layers = {
      ground_layer: map.createBlankLayer('Ground', tileset),
      resource_layer: map.createBlankLayer('Resource', tileset),
      decoration_layer: map.createBlankLayer('Decoration', tileset)
    }
    if (!layers.ground_layer || !layers.resource_layer || !layers.decoration_layer) {
      throw Error('failed to create layers')
    }

    storeSetMap(map)

    this.renderMap()

    // this.entityController!.createAnimations()
    // this.entityController!.addButterflies()
    // this.entityController!.addColonists()
    // this.entityController!.initResources(this.storeRefs.game.value.map.terrainLayout!)
  }

  renderMap() {
    for (let y = 0; y < this.storeRefs.game.value.map.mapHeightTiles; y++) {
      for (let x = 0; x < this.storeRefs.game.value.map.mapWidthTiles; x++) {
        const tileId = this.storeRefs.game.value.map.terrainLayout![y][x]

        let ground_layer = this.storeRefs.game.value.map.tileMap?.getLayer('Ground')
        let resource_layer = this.storeRefs.game.value.map.tileMap?.getLayer('Resource')
        let decoration_layer = this.storeRefs.game.value.map.tileMap?.getLayer('Decoration')

        if (!ground_layer || !resource_layer || !decoration_layer) {
          throw Error('Could not render map')
        }
        if (isTileIdInObject(tileId, TILE_VARIANTS.TERRAIN)) {
          this.storeRefs.game.value.map.tileMap!.putTileAt(tileId, x, y, false, 'Ground')
        } else if (isTileIdInObject(tileId, TILE_VARIANTS.RESOURCES)) {
          this.storeRefs.game.value.map.tileMap!.putTileAt(
            TILE_VARIANTS.TERRAIN.grass.id,
            x,
            y,
            false,
            'Ground'
          )
          this.storeRefs.game.value.map.tileMap!.putTileAt(tileId, x, y, false, 'Resource')
        } else if (isTileIdInObject(tileId, TILE_VARIANTS.DECORATION)) {
          this.storeRefs.game.value.map.tileMap!.putTileAt(
            TILE_VARIANTS.TERRAIN.grass.id,
            x,
            y,
            false,
            'Ground'
          )
          this.storeRefs.game.value.map.tileMap!.putTileAt(tileId, x, y, false, 'Decoration')
        }
      }
    }
  }

  update() {
    this.cameraController!.update()
  }
}

export default MapScene
