import { GameStoreType, useGameStore } from '../../stores/Game'
import MapScene from '../scenes/MapScene'
import { generateColonistName } from '../util'
import { Job } from './Job'

type ColonistBody = {
  headLeft: Phaser.GameObjects.Sprite
  headRight: Phaser.GameObjects.Sprite
  bodyLeft: Phaser.GameObjects.Sprite
  bodyRight: Phaser.GameObjects.Sprite
  legsLeft: Phaser.GameObjects.Sprite
  legsRight: Phaser.GameObjects.Sprite
}

export default class Colonist {
  public id: string
  private scene: MapScene
  public x: number
  public y: number
  private name: string
  private body: ColonistBody
  private walkingSpeed: number
  public occupied: boolean = false
  private nameTag: Phaser.GameObjects.Text
  private container: Phaser.GameObjects.Container
  private currentPath: Phaser.Math.Vector2[] | null = null
  private currentPathIndex: number = 0
  public currentJob: Job | null = null
  private store: GameStoreType

  constructor(id: string, scene: MapScene, x: number, y: number) {
    this.id = id
    this.store = useGameStore()
    this.name = generateColonistName()
    this.scene = scene
    this.x = x
    this.y = y
    this.walkingSpeed = 5000

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

  update(delta: number) {
    if (this.currentJob && !this.occupied) {
      this.startJobMovement()
    }

    if (this.currentPath) {
      this.moveAlongPath(delta)
    } else if (this.currentJob && this.isAtJobLocation()) {
      this.performJob(delta)
    } else {
      this.idle()
    }
  }

  private startJobMovement() {
    if (this.currentJob) {
      const jobLocation = new Phaser.Math.Vector2(this.currentJob.x, this.currentJob.y)
      this.currentPath = this.scene.pathfinder.findPath(
        new Phaser.Math.Vector2(this.x, this.y),
        jobLocation
      )
      this.currentPathIndex = 0
      this.occupied = true
    }
  }

  private moveAlongPath(delta: number) {
    if (!this.currentPath || this.currentPathIndex >= this.currentPath.length) {
      this.currentPath = null
      return
    }

    const targetPoint = this.currentPath[this.currentPathIndex]
    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPoint.x, targetPoint.y)

    if (distance < 1) {
      this.currentPathIndex++
      if (this.currentPathIndex >= this.currentPath.length) {
        this.currentPath = null
        return
      }
    }

    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetPoint.x, targetPoint.y)
    const velocityX = Math.cos(angle) * this.walkingSpeed * (delta / 1000)
    const velocityY = Math.sin(angle) * this.walkingSpeed * (delta / 1000)

    this.x += velocityX
    this.y += velocityY
    this.container.setPosition(this.x, this.y)

    this.updateAnimation(velocityX, velocityY)
  }

  private performJob(delta: number) {
    if (this.currentJob) {
      this.currentJob.progress += delta
      if (this.currentJob.progress >= this.currentJob.duration) {
        this.completeJob()
      }
    }
  }

  private isAtJobLocation(): boolean {
    return (
      this.currentJob! &&
      Math.abs(this.x - this.currentJob.x) < 1 &&
      Math.abs(this.y - this.currentJob.y) < 1
    )
  }

  private idle() {
    // Implement idle behavior if needed
    this.stopWalkAnimation()
  }

  private updateAnimation(velocityX: number, velocityY: number) {
    if (velocityX === 0 && velocityY === 0) {
      this.stopWalkAnimation()
    } else {
      this.playWalkAnimation()
    }
  }

  assignJob(job: Job) {
    this.currentJob = job
    this.occupied = false // This will trigger movement to job location on next update
  }

  completeJob() {
    // Notify job completion (you might want to emit an event here)
    this.currentJob = null
    this.occupied = false
  }

  getState() {
    return {
      x: this.x,
      y: this.y,
      occupied: this.occupied,
      hasJob: !!this.currentJob,
      jobProgress: this.currentJob ? this.currentJob.progress : 0
    }
  }

  // moveColonistTo(targetLocation: number[], onArrival: () => void) {
  //   let targetX = this.store.game.map.tileMap?.tileToWorldX(targetLocation[0])
  //   let targetY = this.store.game.map.tileMap?.tileToWorldY(targetLocation[1])

  //   if (!targetX || !targetY) {
  //     throw Error('Failed parsing target for colonist move')
  //   }

  //   const distance = Phaser.Math.Distance.Between(
  //     this.x * this.store.game.map.tileSize,
  //     this.y * this.store.game.map.tileSize,
  //     targetX,
  //     targetY
  //   )

  //   const duration = this.walkingSpeed

  //   this.playWalkAnimation()

  //   this.scene.tweens.add({
  //     targets: this.container,
  //     x: targetX,
  //     y: targetY,
  //     duration: duration,
  //     onComplete: () => {
  //       this.stopWalkAnimation()

  //       this.x = targetX
  //       this.y = targetY
  //       onArrival()
  //     }
  //   })
  // }
}
