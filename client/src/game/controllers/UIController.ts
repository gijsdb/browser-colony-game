import { eventBus } from '@/eventBus'
import { Terrain } from './TerrainController'
import MapScene from '../scenes/MapScene'
import { GameStoreRefsType, GameStoreType, useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

export default class UIController {
  private scene: Phaser.Scene
  private tileBorderGraphics: Phaser.GameObjects.Graphics | null
  private store: GameStoreType
  private storeRefs: GameStoreRefsType

  constructor(scene: Phaser.Scene) {
    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
    this.scene = scene
    this.tileBorderGraphics = null
    this.scene.input.setDefaultCursor('url(./src/assets/cursors/pointer.svg), pointer')
    this.listen()
    this.setUpInputHandlers()
  }

  // Listen for events from Vue
  listen() {
    eventBus.value.on('button-click', (data) => {
      console.log('Event received in Phaser:', data)
      this.scene.cameras.main.shake(500)
    })

    eventBus.value.on('button-order-woodcut', (data) => {
      console.log('Event received in Phaser:', data)
      this.scene.input.setDefaultCursor('url(./src/assets/cursors/tool_axe.svg), pointer')
    })
  }

  setUpInputHandlers() {
    this.scene.input.on('pointermove', (pointer: any) => {
      const tileX = this.store.game.map.tileMap?.worldToTileX(
        pointer.worldX,
        true,
        this.scene.cameras.main,
        'Ground'
      )
      const tileY = this.store.game.map.tileMap?.worldToTileY(
        pointer.worldY,
        true,
        this.scene.cameras.main,
        'Ground'
      )

      this.handleTileHoverInfo(tileX!, tileY!)
    })
  }

  handleTileHoverInfo(tileX: number, tileY: number) {
    if (!this.tileBorderGraphics) {
      this.tileBorderGraphics = this.scene!.add.graphics()
    }

    const groundTile = this.storeRefs.game.value.map.tileMap?.getTileAt(
      tileX,
      tileY,
      true,
      'Ground'
    )
    const resourceTile = this.storeRefs.game.value.map.tileMap?.getTileAt(
      tileX,
      tileY,
      true,
      'Resource'
    )
    const decorationTile = this.storeRefs.game.value.map.tileMap?.getTileAt(
      tileX,
      tileY,
      true,
      'Decoration'
    )

    if (groundTile || resourceTile || decorationTile) {
      const tile = groundTile || resourceTile || decorationTile
      let layerName = 'Ground'
      if (!resourceTile) {
        layerName = 'Resource'
      }
      if (!decorationTile) {
        layerName = 'Decoration'
      }

      eventBus.value.emit('hover-info', {
        tileX: tile?.x,
        tileY: tile?.y,
        type: this.storeRefs.game.value.map.terrainLayout![tileY][tileX],
        layer: layerName
      })
      this.tileBorderGraphics.clear()
      this.tileBorderGraphics.lineStyle(2, 0x00ff00, 1)
      this.tileBorderGraphics.strokeRect(tileX * 32, tileY * 32, 32, 32)
    } else {
      this.tileBorderGraphics.clear()
    }
  }
}
