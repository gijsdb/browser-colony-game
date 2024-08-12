import { GameStoreJob, GameStoreRefsType, GameStoreType, useGameStore } from '../../stores/Game'
import { TILE_VARIANTS } from '../mapgen/TileVariants'
import Colonist from '../entities/Colonist'
import { storeToRefs } from 'pinia'
import { eventBus } from '../../eventBus'

type Job = {
  location: number[] //x,y
  inProgress: boolean
  type: JobType
  resourceId?: number
}

type JobType = 'harvest' | 'build'

export interface ColonistServiceI {
  initialColonistAmount: number
  spawnColonist(amount: number): void
  createAnimations(): void
  destroy(): void
}

export class ColonistService implements ColonistServiceI {
  private store: GameStoreType
  private storeRefs: GameStoreRefsType
  public initialColonistAmount: number
  private jobs: Job[]
  private jobsInterval: NodeJS.Timeout | null

  constructor(initialColonistAmount: number) {
    this.initialColonistAmount = initialColonistAmount
    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
    this.jobs = []
    this.jobsInterval = null
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
        if (!tile) {
          throw Error('No tile to spawn colonist')
          return
        }
        if (tile.index != TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX) {
          x = null
          y = null
        }
      } while (x == null && y == null)
      const colonist = new Colonist(this.storeRefs.game.value.currentScene!, x || 0, y || 0)
      storeAddColonist(colonist)
    }

    this.listenForOrders()
    this.startJobProcessing()
  }

  listenForOrders() {
    eventBus.value.on('resource-marked-for-harvest', (data) => {
      let d = data as GameStoreJob
      console.log('D', d)
      this.jobs.push({
        location: d.location,
        inProgress: false,
        type: 'harvest',
        resourceId: d.resourceId
      })
    })
  }

  startJobProcessing() {
    this.jobsInterval = setInterval(() => {
      if (this.jobs.length > 0) {
        this.jobs.forEach((job) => {
          if (!job.inProgress) {
            this.performJob(job)
            job.inProgress = true
            return
          }
        })
      }
    }, 1500)
  }

  performJob(job: Job) {
    job.inProgress = true
    const colonist = this.getClosestColonist(job.location)
    if (!colonist) {
      job.inProgress = false
      console.log('No colonist available for the job')
      return
    }
    colonist.moveColonistTo(job.location, () => {
      // simulate job
      setTimeout(() => {
        console.log('Job completed')
        this.jobs.shift()
        colonist.occupied = false
        eventBus.value.emit('resource-harvested', { resourceId: job.resourceId })
      }, 2000) // Time taken to complete the job
    })
  }

  getClosestColonist(location: number[]): Colonist | null {
    let closestColonist: Colonist | null = null
    let shortestDistance = Infinity

    for (const colonist of this.storeRefs.game.value.colonists) {
      const distance = Phaser.Math.Distance.Between(
        colonist.x,
        colonist.y,
        location[0],
        location[1]
      )

      if (distance < shortestDistance && !colonist.occupied) {
        shortestDistance = distance
        closestColonist = colonist
      }
    }

    return closestColonist
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

  destroy(): void {
    clearInterval(this.jobsInterval!)
  }
}
