import { GameStoreJob, GameStoreRefsType, GameStoreType, useGameStore } from '../../stores/Game'
import { TILE_VARIANTS } from '../mapgen/TileVariants'
import Colonist from '../entities/Colonist'
import { storeToRefs } from 'pinia'
import { eventBus } from '../../eventBus'
import { GameStoreRepoI } from '../../repositories/GameStoreRepo'
import Resource from '../entities/resources/Resource'
import { Job } from '../entities/Job'
import { JobServiceI } from './JobService'

export interface ColonistServiceI {
  initialColonistAmount: number
  spawnColonist(amount: number): void
  createAnimations(): void
  update(delta: number): void
  destroy(): void
}

export class ColonistService implements ColonistServiceI {
  public initialColonistAmount: number
  private colonists: Colonist[] = []
  private jobService: JobServiceI
  private gameStoreRepo: GameStoreRepoI

  constructor(
    initialColonistAmount: number,
    gameStoreRepo: GameStoreRepoI,
    jobService: JobServiceI
  ) {
    this.initialColonistAmount = initialColonistAmount
    this.jobService = jobService
    this.gameStoreRepo = gameStoreRepo
  }

  spawnColonist(amount: number): void {
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
        }
        if (tile.index != TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX) {
          x = null
          y = null
        }
      } while (x == null && y == null)
      const colonist = new Colonist(this.storeRefs.game.value.currentScene!, x || 0, y || 0)
      this.gameStoreRepo.addColonist(colonist)
    }
  }

  // startJobProcessing() {
  //   const { storeUpdateColonist } = this.store

  //   this.jobsInterval = setInterval(() => {
  //     if (this.jobs.length > 0) {
  //       this.jobs.forEach((job) => {
  //         if (!job.inProgress) {
  //           const colonist = this.getClosestColonist(job.location)
  //           if (!colonist) {
  //             console.log('No colonist available for the job')
  //             return
  //           }
  //           storeUpdateColonist(colonist)
  //           job.inProgress = true
  //           this.performJob(job, colonist)
  //           colonist.occupied = false
  //           storeUpdateColonist(colonist)

  //           return
  //         }
  //       })
  //     }
  //   }, 1000)
  // }

  // // store gets out of sync with these colonists
  // performJob(job: Job, colonist: Colonist) {
  //   colonist.moveColonistTo(job.location, () => {
  //     // simulate job
  //     setTimeout(() => {
  //       console.log('Job completed')
  //       this.jobs.shift()
  //       eventBus.value.emit('resource-harvested', { resourceId: job.resourceId })
  //     }, 2000) // Time taken to complete the job
  //   })
  // }

  // getClosestColonist(location: number[]): Colonist | null {
  //   let closestColonist: Colonist | null = null
  //   let shortestDistance = Infinity

  //   for (const colonist of this.storeRefs.game.value.colonists) {
  //     const distance = Phaser.Math.Distance.Between(
  //       colonist.x,
  //       colonist.y,
  //       location[0],
  //       location[1]
  //     )

  //     if (distance < shortestDistance && !colonist.occupied) {
  //       shortestDistance = distance
  //       colonist.occupied = true
  //       closestColonist = colonist
  //     }
  //   }

  //   return closestColonist
  // }

  update(delta: number) {
    this.colonists.forEach((colonist) => {
      colonist.update(delta)

      if (!colonist.occupied && !colonist.currentJob) {
        const job = this.jobService.assignJob(colonist.id)
        if (job) {
          colonist.assignJob(job)
        }
      }

      if (colonist.currentJob && colonist.currentJob.isCompleted) {
        this.jobService.completeJob(colonist.currentJob.id)
        colonist.completeJob()
      }
    })
  }

  getState(): any {
    return {
      colonists: this.colonists.map((colonist) => colonist.getState())
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

  destroy(): void {
    clearInterval(this.jobsInterval!)
  }
}
