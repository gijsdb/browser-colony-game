import { eventBus } from '@/eventBus'
import { GameStoreRefsType, GameStoreType, useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { TILE_VARIANTS } from '../mapgen/TileVariants'

type ClickMode = 'normal' | 'harvestWood'

export default class UIController {
  private tileBorderGraphics: Phaser.GameObjects.Graphics | null
  private store: GameStoreType
  private storeRefs: GameStoreRefsType
  private clickMode: ClickMode

  constructor() {
    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
    this.tileBorderGraphics = null
    this.clickMode = 'normal'
    this.storeRefs.game.value.currentScene!.input.setDefaultCursor(
      'url(./src/assets/cursors/pointer.svg), pointer'
    )
    this.listen()
  }

  setClickMode(mode: ClickMode): void {
    switch (mode) {
      case 'normal':
        this.storeRefs.game.value.currentScene!.input.setDefaultCursor(
          'url(./src/assets/cursors/pointer.svg), pointer'
        )
      case 'harvestWood':
        this.storeRefs.game.value.currentScene!.input.setDefaultCursor(
          'url(./src/assets/cursors/tool_axe.svg), pointer'
        )
    }

    this.clickMode = mode
  }

  // Listen for events from Vue
  listen() {
    eventBus.value.on('button-click', (data) => {
      console.log('Event received in Phaser:', data)
      this.storeRefs.game.value.currentScene!.cameras.main.shake(500)
    })

    eventBus.value.on('button-order-woodcut', (data) => {
      console.log('Event received in Phaser:', data)
      this.setClickMode('harvestWood')
    })
  }

  setUpInputHandlers() {
    this.storeRefs.game.value.currentScene!.input.on('pointermove', (pointer: any) => {
      const tileX = this.store.game.map.tileMap?.worldToTileX(
        pointer.worldX,
        true,
        this.storeRefs.game.value.currentScene!.cameras.main,
        'Ground'
      )
      const tileY = this.store.game.map.tileMap?.worldToTileY(
        pointer.worldY,
        true,
        this.storeRefs.game.value.currentScene!.cameras.main,
        'Ground'
      )

      this.handleTileHoverInfo(tileX!, tileY!)
    })

    this.storeRefs.game.value.currentScene!.input.on('pointerdown', (pointer: any) => {
      const tileX = this.store.game.map.tileMap?.worldToTileX(
        pointer.worldX,
        true,
        this.storeRefs.game.value.currentScene!.cameras.main,
        'Ground'
      )
      const tileY = this.store.game.map.tileMap?.worldToTileY(
        pointer.worldY,
        true,
        this.storeRefs.game.value.currentScene!.cameras.main,
        'Ground'
      )

      if (!tileX || !tileY) {
        return
      }

      this.handleTileClick(tileX, tileY)
    })
  }

  handleTileClick(tileX: number, tileY: number) {
    const { storeSetResourceToHarvest } = this.store
    let tileClicked = this.storeRefs.game.value.map.terrainLayout[tileY][tileX]
    switch (this.clickMode) {
      case 'harvestWood':
        if (
          tileClicked === TILE_VARIANTS.RESOURCE_LAYER.TREE_TOP.TILE_MAP_INDEX ||
          tileClicked === TILE_VARIANTS.RESOURCE_LAYER.TREE_TRUNK.TILE_MAP_INDEX
        ) {
          let gameStoreJob = storeSetResourceToHarvest(tileX, tileY)
          if (gameStoreJob) {
            eventBus.value.emit('resource-marked-for-harvest', gameStoreJob)
          }
        }
      default:
        console.log(`Clicked on tile: x=${tileX}, y=${tileY}`)
        return
    }
  }

  handleTileHoverInfo(tileX: number, tileY: number) {
    if (!this.tileBorderGraphics) {
      this.tileBorderGraphics = this.storeRefs.game.value.currentScene!.add.graphics()
    }

    const groundTile = this.storeRefs.game.value.map.tileMap?.getTileAt(
      tileX,
      tileY,
      false,
      'Ground'
    )
    const resourceTile = this.storeRefs.game.value.map.tileMap?.getTileAt(
      tileX,
      tileY,
      false,
      'Resource'
    )
    const decorationTile = this.storeRefs.game.value.map.tileMap?.getTileAt(
      tileX,
      tileY,
      false,
      'Decoration'
    )

    if (groundTile || resourceTile || decorationTile) {
      const tile = groundTile || resourceTile || decorationTile
      let layerName = 'Ground'
      if (resourceTile) {
        layerName = 'Resource'
      }
      if (decorationTile) {
        layerName = 'Decoration'
      }

      eventBus.value.emit('hover-info', {
        tileX: tile?.x,
        tileY: tile?.y,
        type: this.storeRefs.game.value.map.terrainLayout![tileY][tileX],
        layer: layerName
      })
      this.tileBorderGraphics!.clear()
      this.tileBorderGraphics!.lineStyle(2, 0x00ff00, 1)
      this.tileBorderGraphics!.strokeRect(tileX * 32, tileY * 32, 32, 32)
    } else {
      this.tileBorderGraphics!.clear()
    }
  }
}
