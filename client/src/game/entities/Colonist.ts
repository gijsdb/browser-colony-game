import { GameStoreType, useGameStore } from '@/stores/game'
import { generateColonistName } from '../util'

type ColonistBody = {
  headLeft: Phaser.GameObjects.Sprite
  headRight: Phaser.GameObjects.Sprite
  bodyLeft: Phaser.GameObjects.Sprite
  bodyRight: Phaser.GameObjects.Sprite
  legsLeft: Phaser.GameObjects.Sprite
  legsRight: Phaser.GameObjects.Sprite
}

export default class Colonist {
  private scene: Phaser.Scene
  public x: number
  public y: number
  private name: string
  private body: ColonistBody
  private walkingSpeed: number
  public occupied: boolean
  private nameTag: Phaser.GameObjects.Text
  private container: Phaser.GameObjects.Container
  private store: GameStoreType

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.store = useGameStore()
    this.name = generateColonistName()
    this.scene = scene
    this.x = x
    this.y = y
    this.walkingSpeed = 100
    this.occupied = false

    this.body = {
      headLeft: this.scene.add.sprite(0, 0, 'colonist', 0),
      headRight: this.scene.add.sprite(16, 0, 'colonist', 1),
      bodyLeft: this.scene.add.sprite(0, 16, 'colonist', 16),
      bodyRight: this.scene.add.sprite(16, 16, 'colonist', 17),
      legsLeft: this.scene.add.sprite(0, 32, 'colonist', 32),
      legsRight: this.scene.add.sprite(16, 32, 'colonist', 33)
    }

    this.nameTag = this.scene.add.text(-13, 35, this.name, {
      fontSize: 13,
      strokeThickness: 0.5
    })

    this.container = this.scene.add.container(
      this.x * this.store.game.map.tileSize,
      this.y * this.store.game.map.tileSize,
      [
        this.body.headLeft,
        this.body.headRight,
        this.body.bodyLeft,
        this.body.bodyRight,
        this.body.legsLeft,
        this.body.legsRight,
        this.nameTag
      ]
    )
  }

  playWalkAnimation() {
    this.body.headLeft.play('colonist_walk_head_left')
    this.body.headRight.play('colonist_walk_head_right')
    this.body.bodyLeft.play('colonist_walk_body_left')
    this.body.bodyRight.play('colonist_walk_body_right')
    this.body.legsLeft.play('colonist_walk_legs_left')
    this.body.legsRight.play('colonist_walk_legs_right')
  }

  stopWalkAnimation() {
    this.body.headLeft.stop()
    this.body.headRight.stop()
    this.body.bodyLeft.stop()
    this.body.bodyRight.stop()
    this.body.legsLeft.stop()
    this.body.legsRight.stop()
  }

  moveColonistTo(targetLocation: number[], onArrival: () => void) {
    this.occupied = true
    let targetX = this.store.game.map.tileMap?.tileToWorldX(targetLocation[0])
    let targetY = this.store.game.map.tileMap?.tileToWorldY(targetLocation[1])

    if (!targetX || !targetY) {
      throw Error('Failed parsing target for colonist move')
    }

    const distance = Phaser.Math.Distance.Between(
      this.x * this.store.game.map.tileSize,
      this.y * this.store.game.map.tileSize,
      targetX,
      targetY
    )

    const duration = (distance / this.walkingSpeed) * 1000

    this.playWalkAnimation()

    this.scene.tweens.add({
      targets: this.container,
      x: targetX,
      y: targetY,
      duration: duration,
      onComplete: () => {
        this.stopWalkAnimation()

        this.x = targetX
        this.y = targetY

        onArrival()
      }
    })
  }
}
