import Phaser from 'phaser'
import MapScene from '../scenes/MapScene'
import EntityController from './EntityController'
import { TerrainController } from './TerrainController'
import UIController from './UIController'
import CameraController from './CameraController'
import { GameStoreRefsType, GameStoreType, useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import ColonistService from '@/game/services/colonist'
import ColonistServiceI from '@/game/services/colonist'

export default class GameController {
  private game: Phaser.Game | null
  private entityController: EntityController
  private terrainController: TerrainController
  private uiController: UIController | undefined
  private cameraController: CameraController
  private store: GameStoreType
  private storeRefs: GameStoreRefsType
  private colonistService: ColonistServiceI | undefined

  constructor(colonistAmount: number) {
    this.entityController = new EntityController(colonistAmount)
    this.terrainController = new TerrainController()
    this.cameraController = new CameraController()

    this.store = useGameStore()
    this.storeRefs = storeToRefs(this.store)
    const { storeSetTerrainLayout, storeSetCurrentScene } = this.store

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      //scene: new MapScene(colonistAmount),
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      // parent: container_id, // Set if you need the game placed somewhere specific e.g. inside a div. Without it is added to body
      transparent: true,
      callbacks: {
        preBoot: (game: Phaser.Game) => {
          game.scene.add('MapScene', MapScene, true, {
            entityController: this.entityController,
            cameraController: this.cameraController
          })

          let terrain = this.terrainController.generateTerrainPerlinNoise(
            this.store.game.map.mapWidthTiles,
            this.store.game.map.mapHeightTiles
          )
          terrain = this.terrainController.addResourcesToTerrain(terrain)
          terrain = this.terrainController.addDecoration(terrain)
          storeSetTerrainLayout(terrain)
        },
        postBoot: (game: Phaser.Game) => {
          const scene = game.scene.getScene('MapScene')
          this.uiController = new UIController(scene)
          this.entityController.setScene(scene)
          this.cameraController.setScene(scene)
          storeSetCurrentScene(scene)
          this.colonistService = new ColonistService(colonistAmount)
        }
      }
    }

    this.game = new Phaser.Game(config)
  }

  public endGame(): void {
    this.game?.destroy(true)
    this.game = null
  }
}
