import { GameStoreRefsType, GameStoreType, useGameStore } from '@/stores/game'
import { TILE_VARIANTS } from '../controllers/TerrainController'
import Colonist from '../entities/colonist'
import { storeToRefs } from 'pinia'

export default interface ColonistServiceI {}

export default class ColonistService implements ColonistServiceI {
  private store: GameStoreType
  private storeRefs: GameStoreRefsType
  private colonists: Colonist[]

  constructor(initialColonistAmount: number) {
    this.colonists = []
    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
    // this.spawnColonist(initialColonistAmount)
  }

  spawnColonist(amount: number): void {
    const centerX = Math.floor(this.store.game.map.mapWidthTiles / 2)
    const centerY = Math.floor(this.store.game.map.mapHeightTiles / 2)
    const spawnRadius = 10
    for (let i = 0; i < amount; i++) {
      let x, y
      do {
        x = Phaser.Math.Between(centerX - spawnRadius, centerX + spawnRadius)
        y = Phaser.Math.Between(centerY - spawnRadius, centerY + spawnRadius)
        let tile = this.storeRefs.game.value.map.tileMap?.getTileAt(x, y, false)
        if (tile!.index != TILE_VARIANTS.TERRAIN.grass.id || !tile) {
          x = null
          y = null
        }
      } while (x == null && y == null)
      const colonist = new Colonist(this.storeRefs.game.value.currentScene!, x || 0, y || 0)
      this.colonists.push(colonist)
    }
  }
}
