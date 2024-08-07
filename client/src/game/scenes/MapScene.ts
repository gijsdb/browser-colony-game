import Phaser from 'phaser'
import tiles from '@/assets/tilesets/forest_tiles_fixed.png'
import { Terrain, TerrainController, TILE_VARIANTS } from '@/game/controllers/TerrainController'
import EntityController from '@/game/controllers/EntityController'
import UIController from '@/game/controllers/UIController'
import CameraController from '@/game/controllers/CameraController'
import { isTileIdInObject } from '@/game/util'

type Layers = {
  ground_layer: Phaser.Tilemaps.TilemapLayer | null
  resource_layer: Phaser.Tilemaps.TilemapLayer | null
  decoration_layer: Phaser.Tilemaps.TilemapLayer | null
}

class MapScene extends Phaser.Scene {
  public layers: Layers
  public tileSize: number
  public mapWidth: number
  public mapHeight: number
  private entityController?: EntityController
  private cameraController?: CameraController
  private terrainController?: TerrainController
  private uiController?: UIController
  private terrain: Terrain
  private map: Phaser.Tilemaps.Tilemap | undefined

  constructor() {
    super({ key: 'MapScene' })

    this.layers = {
      ground_layer: null,
      resource_layer: null,
      decoration_layer: null
    }
    this.tileSize = 32
    this.mapWidth = 100
    this.mapHeight = 100
    this.terrain = []
  }

  preload() {
    this.load.image('tiles', tiles)
  }

  create() {
    let data = this.sys.getData()
    this.map = this.make.tilemap({
      tileWidth: this.tileSize,
      tileHeight: this.tileSize,
      width: this.mapWidth,
      height: this.mapHeight
    })

    this.entityController = data.entityController
    this.terrainController = data.terrainController
    this.uiController = data.uiController
    this.cameraController = data.cameraController

    if (
      !this.terrainController ||
      !this.entityController ||
      !this.uiController ||
      !this.cameraController
    ) {
      throw Error('no controllers provided')
    }

    const tileset = this.map.addTilesetImage('tileset-name', 'tiles', 32, 32, 1, 2)
    if (!tileset) {
      throw Error('failed to load tileset')
    }
    this.layers.ground_layer = this.map.createBlankLayer('Ground', tileset)
    this.layers.resource_layer = this.map.createBlankLayer('Resource', tileset)
    this.layers.decoration_layer = this.map.createBlankLayer('Decoration', tileset)
    if (!this.layers.ground_layer || !this.layers.resource_layer || !this.layers.decoration_layer) {
      throw Error('failed to create layers')
    }

    this.terrain = this.terrainController.generateTerrainPerlinNoise(this.mapWidth, this.mapHeight)
    this.terrain = this.terrainController.addResources(this.terrain)
    this.terrain = this.terrainController.addDecoration(this.terrain)

    this.renderMap(this.map, this.terrain)

    this.entityController?.createAnimations()
    this.entityController?.addButterflies()
    this.entityController?.addColonists()

    this.uiController?.setUpInputHandlers(this.map, this.terrain)
  }

  renderMap(map: Phaser.Tilemaps.Tilemap, terrain: Terrain) {
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        const tileId = terrain[y][x]
        if (isTileIdInObject(tileId, TILE_VARIANTS.TERRAIN)) {
          map.putTileAt(tileId, x, y, false, this.layers.ground_layer || 0)
        } else if (isTileIdInObject(tileId, TILE_VARIANTS.RESOURCES)) {
          this.layers.ground_layer?.putTileAt(TILE_VARIANTS.TERRAIN.grass.id, x, y)
          map.putTileAt(tileId, x, y, false, this.layers.resource_layer || 0)
        } else if (isTileIdInObject(tileId, TILE_VARIANTS.DECORATION)) {
          this.layers.ground_layer?.putTileAt(TILE_VARIANTS.TERRAIN.grass.id, x, y)
          map.putTileAt(tileId, x, y, false, this.layers.decoration_layer || 0)
        }
      }
    }
  }

  update() {
    this.cameraController!.update()
    this.entityController!.update()
  }
}

export default MapScene
