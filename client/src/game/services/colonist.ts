import { GameStoreRefsType, GameStoreType, useGameStore } from '@/stores/game'
import { TILE_VARIANTS } from '../mapgen/TileVariants'
import Colonist from '../entities/colonist'
import { storeToRefs } from 'pinia'

export interface ColonistServiceI {
  initialColonistAmount: number
  spawnColonist(amount: number): void
  createAnimations(): void
}

export class ColonistService implements ColonistServiceI {
  private store: GameStoreType
  private storeRefs: GameStoreRefsType
  public initialColonistAmount: number

  constructor(initialColonistAmount: number) {
    this.initialColonistAmount = initialColonistAmount
    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
  }

  spawnColonist(amount: number): void {
    const { storeAddColonist } = this.store

    const centerX = Math.floor(this.storeRefs.game.value.map.mapWidthTiles / 2)
    const centerY = Math.floor(this.storeRefs.game.value.map.mapHeightTiles / 2)
    const spawnRadius = 10
    for (let i = 0; i < amount; i++) {
      let x, y
      do {
        x = Phaser.Math.Between(centerX - spawnRadius, centerX + spawnRadius)
        y = Phaser.Math.Between(centerY - spawnRadius, centerY + spawnRadius)
        let tile = this.storeRefs.game.value.map.tileMap?.getTileAt(x, y, false, 'Ground')

        if (tile!.index != TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX) {
          x = null
          y = null
        }
      } while (x == null && y == null)
      const colonist = new Colonist(this.storeRefs.game.value.currentScene!, x || 0, y || 0)
      storeAddColonist(colonist)
    }
  }

  createAnimations(): void {
    this.storeRefs.game.value.currentScene!.anims.create({
      key: 'colonist_walk_head_left',
      frames: this.storeRefs.game.value.currentScene!.anims.generateFrameNumbers('colonist', {
        frames: [0, 2, 4, 6, 8, 10, 12, 14]
      }),
      frameRate: 10,
      repeat: -1
    })
    this.storeRefs.game.value.currentScene!.anims.create({
      key: 'colonist_walk_head_right',
      frames: this.storeRefs.game.value.currentScene!.anims.generateFrameNumbers('colonist', {
        frames: [1, 3, 5, 7, 9, 11, 13, 15]
      }),
      frameRate: 10,
      repeat: -1
    })
    this.storeRefs.game.value.currentScene!.anims.create({
      key: 'colonist_walk_body_left',
      frames: this.storeRefs.game.value.currentScene!.anims.generateFrameNumbers('colonist', {
        frames: [16, 18, 20, 22, 24, 26, 28, 30]
      }),
      frameRate: 10,
      repeat: -1
    })
    this.storeRefs.game.value.currentScene!.anims.create({
      key: 'colonist_walk_body_right',
      frames: this.storeRefs.game.value.currentScene!.anims.generateFrameNumbers('colonist', {
        frames: [17, 19, 21, 23, 25, 27, 29, 31]
      }),
      frameRate: 10,
      repeat: -1
    })
    this.storeRefs.game.value.currentScene!.anims.create({
      key: 'colonist_walk_legs_left',
      frames: this.storeRefs.game.value.currentScene!.anims.generateFrameNumbers('colonist', {
        frames: [32, 34, 36, 38, 40, 42, 44, 46]
      }),
      frameRate: 10,
      repeat: -1
    })
    this.storeRefs.game.value.currentScene!.anims.create({
      key: 'colonist_walk_legs_right',
      frames: this.storeRefs.game.value.currentScene!.anims.generateFrameNumbers('colonist', {
        frames: [33, 35, 37, 39, 41, 43, 45, 47]
      }),
      frameRate: 10,
      repeat: -1
    })
  }
}
