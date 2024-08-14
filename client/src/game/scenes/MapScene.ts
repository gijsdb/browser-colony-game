import Phaser from 'phaser'
import tiles from '../../assets/tilesets/forest_tiles_fixed.png'
import colonist_img from '../../assets/characters/colonist.png'
import { TILE_VARIANTS } from '../mapgen/TileVariants'
import CameraController from '../controllers/CameraController'
import { isTileIdInObject } from '../util'
import { GameStoreType, useGameStore } from '../../stores/Game'
import { ColonistServiceI } from '../services/Colonist'
import { ResourceServiceI } from '../services/Resource'
import { JobServiceI } from '../services/JobService'

class MapScene extends Phaser.Scene {
  private colonistService?: ColonistServiceI
  private resourceService?: ResourceServiceI
  private jobService?: JobServiceI
  private cameraController?: CameraController
  private butterflies: Phaser.GameObjects.Group | undefined
  private store: GameStoreType

  constructor() {
    super({ key: 'MapScene' })
    this.store = useGameStore()
    this.butterflies = undefined
  }

  preload() {
    this.load.image('tiles', tiles)
    this.load.image('colonists', colonist_img)

    this.load.spritesheet('butterfly', tiles, {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2
    })

    this.load.spritesheet('colonist', colonist_img, {
      frameWidth: 16,
      frameHeight: 16
    })
  }

  initControllers() {
    let data = this.sys.getData()

    this.colonistService = data.colonistService
    this.resourceService = data.resourceService
    this.cameraController = new CameraController(this)

    if (!this.colonistService || !this.resourceService) {
      throw Error('no controllers provided to scene')
    }
  }

  create() {
    const { storeSetMap } = this.store
    this.initControllers()

    let map = this.make.tilemap({
      tileHeight: this.store.game.map.tileSize,
      width: this.store.game.map.mapWidthTiles,
      height: this.store.game.map.mapHeightTiles
    })

    const tileset = map.addTilesetImage(
      'tileset-name',
      'tiles',
      this.store.game.map.tileSize,
      this.store.game.map.tileSize,
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

    this.colonistService!.spawnColonist(this.colonistService!.initialColonistAmount)
    this.colonistService!.createAnimations()
    this.resourceService!.spawnResources()

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('butterfly', { start: 89, end: 91 }),
      frameRate: 5,
      repeat: -1
    })
    this.addButterflies()
  }

  renderMap(): void {
    for (let y = 0; y < this.store.game.map.mapHeightTiles; y++) {
      for (let x = 0; x < this.store.game.map.mapWidthTiles; x++) {
        const tileId = this.store.game.map.terrainLayout![y][x]
        let ground_layer = this.store.game.map.tileMap!.getLayer('Ground')
        let resource_layer = this.store.game.map.tileMap!.getLayer('Resource')
        let decoration_layer = this.store.game.map.tileMap!.getLayer('Decoration')
        if (!ground_layer || !resource_layer || !decoration_layer) {
          throw Error(
            `Could not render map! ground layer: ${ground_layer} resource layer: ${resource_layer} decoration layer: ${decoration_layer}`
          )
        }
        if (isTileIdInObject(tileId, TILE_VARIANTS.GROUND_LAYER)) {
          this.store.game.map.tileMap!.putTileAt(tileId, x, y, false, 'Ground')
        } else if (isTileIdInObject(tileId, TILE_VARIANTS.RESOURCE_LAYER)) {
          this.store.game.map.tileMap!.putTileAt(
            TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX,
            x,
            y,
            false,
            'Ground'
          )
          this.store.game.map.tileMap!.putTileAt(tileId, x, y, false, 'Resource')
        } else if (isTileIdInObject(tileId, TILE_VARIANTS.DECORATION_LAYER)) {
          this.store.game.map.tileMap!.putTileAt(
            TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX,
            x,
            y,
            false,
            'Ground'
          )
          this.store.game.map.tileMap!.putTileAt(tileId, x, y, false, 'Decoration')
        }
      }
    }
  }

  update(time: number, delta: number) {
    this.cameraController?.update()
    this.colonistService?.update(delta)
    this.jobService?.update(delta)
    // this.resourceService?.update(delta)
  }

  // moved here butterfly stuff here for now
  addButterflies() {
    this.butterflies = this.add.group()
    for (let i = 0; i < 10; i++) {
      // Adjust the number of butterflies
      const x = Phaser.Math.Between(
        0,
        this.store.game.map.mapWidthTiles * this.store.game.map.tileSize
      )
      const y = Phaser.Math.Between(
        0,
        this.store.game.map.mapHeightTiles * this.store.game.map.mapWidthTiles
      )

      const butterfly = this.butterflies!.create(x, y, 'butterfly').play('fly')
      this.addButterflyMovement(butterfly)
    }
  }

  addButterflyMovement(butterfly: any) {
    const duration = Phaser.Math.Between(30000, 50000) // Adjust the duration for movement

    this.tweens.add({
      targets: butterfly,
      x: {
        value: () =>
          Phaser.Math.Between(0, this.store.game.map.mapWidthTiles * this.store.game.map.tileSize),
        duration: duration
      },
      y: {
        value: () =>
          Phaser.Math.Between(0, this.store.game.map.mapHeightTiles * this.store.game.map.tileSize),
        duration: duration
      },
      onComplete: () => {
        this.addButterflyMovement(butterfly)
      }
    })
  }
}

export default MapScene
