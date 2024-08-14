import { GameStoreJob, GameStoreRefsType, GameStoreType, useGameStore } from '../stores/Game'

import Colonist from '../game/entities/Colonist'
import { storeToRefs } from 'pinia'
import Resource from '../game/entities/resources/Resource'

export interface GameStoreRepoI {
  addColonist(colonist: Colonist): Colonist
  markResourceForHarvest(tileX: number, tileY: number): Resource | null
  addResourceToInventory(type: string, value: number)
}

export class GameStoreRepo implements GameStoreRepoI {
  private store: ReturnType<typeof useGameStore>
  private storeRefs: GameStoreRefsType

  constructor() {
    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
  }

  // syncState(colonistState: ColonistState, resourceState: ResourceState) {
  //   // Update colonist state
  //   this.store.storeSetColonists(colonistState.colonists)
  //   this.store.storeSetJobs(colonistState.jobs)

  //   // Update resource state
  //   this.store.storeSetResources(resourceState.resources)
  //   this.store.storeSetInventory(resourceState.inventory)

  //   // You might also want to update other game state here
  //   // For example, map state, time, etc.
  // }

  addColonist(colonist: Colonist): Colonist {
    const { storeAddColonist } = this.store

    return storeAddColonist(colonist)
  }

  markResourceForHarvest(tileX: number, tileY: number): Resource | null {
    const { storeSetResourceToHarvest } = this.store
    return storeSetResourceToHarvest(tileX, tileY)
  }

  addResourceToInventory(type: string, value: number) {
    const { storeAddResourceToInventory } = this.store
    // move more logic into here from the store for this func
    return storeAddResourceToInventory(type, value)
  }
}
