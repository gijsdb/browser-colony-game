import MapScene from '../scenes/MapScene'
import { GameStoreType, useGameStore } from '@/stores/game'
import { generateColonistName } from '../util'

type ColonistBody = {
  headTopLeft: Phaser.GameObjects.Sprite
  headTopRight: Phaser.GameObjects.Sprite
  bodyTopLeft: Phaser.GameObjects.Sprite
  bodyTopRight: Phaser.GameObjects.Sprite
  legsTopLeft: Phaser.GameObjects.Sprite
  legsTopRight: Phaser.GameObjects.Sprite
}

export default class Colonist {
  private scene: Phaser.Scene
  private x: number
  private y: number
  private name: string
  private body: ColonistBody
  private nameTag: Phaser.GameObjects.Text
  private container: Phaser.GameObjects.Container
  private store: GameStoreType

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.store = useGameStore()
    this.name = generateColonistName()
    this.scene = scene
    this.x = x
    this.y = y

    this.body = {
      headTopLeft: this.scene.add.sprite(0, 0, 'colonist', 0),
      headTopRight: this.scene.add.sprite(16, 0, 'colonist', 1),
      bodyTopLeft: this.scene.add.sprite(0, 16, 'colonist', 16),
      bodyTopRight: this.scene.add.sprite(16, 16, 'colonist', 17),
      legsTopLeft: this.scene.add.sprite(0, 32, 'colonist', 32),
      legsTopRight: this.scene.add.sprite(16, 32, 'colonist', 33)
    }

    this.nameTag = this.scene.add.text(-13, 35, this.name, {
      fontSize: 13,
      strokeThickness: 0.5
    })

    this.container = this.scene.add.container(
      this.x * this.store.game.map.tileSize,
      this.y * this.store.game.map.tileSize,
      [
        this.body.headTopLeft,
        this.body.headTopRight,
        this.body.bodyTopLeft,
        this.body.bodyTopRight,
        this.body.legsTopLeft,
        this.body.legsTopRight,
        this.nameTag
      ]
    )
  }
}
