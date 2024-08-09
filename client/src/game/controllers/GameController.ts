import Phaser from 'phaser'
import MapScene from '../scenes/MapScene'
import { TerrainGenerator } from '../mapgen/TerrainGenerator'
import UIController from './UIController'
import { GameStoreType, useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { ColonistService, ColonistServiceI } from '@/game/services/colonist'
import { ResourceServiceI, ResourceService } from '@/game/services/resource'

export default class GameController {
  private game: Phaser.Game | null
  private terrainGenerator: TerrainGenerator
  private store: GameStoreType
  private colonistService: ColonistServiceI
  private resourceService: ResourceServiceI
  private uiController?: UIController

  constructor(colonistAmount: number) {
    this.store = useGameStore()
    const { storeSetTerrainLayout, storeSetCurrentScene } = this.store

    this.terrainGenerator = new TerrainGenerator()
    this.colonistService = new ColonistService(colonistAmount)
    this.resourceService = new ResourceService()

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
            colonistService: this.colonistService,
            resourceService: this.resourceService
          })

          let terrain = this.terrainGenerator.generateTerrainPerlinNoise(
            this.store.game.map.mapWidthTiles,
            this.store.game.map.mapHeightTiles
          )
          terrain = this.terrainGenerator.addResourcesToTerrain(terrain)
          terrain = this.terrainGenerator.addDecorationToTerrain(terrain)
          storeSetTerrainLayout(terrain)
        },
        postBoot: (game: Phaser.Game) => {
          const scene = game.scene.getScene('MapScene')
          storeSetCurrentScene(scene)
          this.uiController = new UIController()
          this.uiController.setUpInputHandlers()
        }
      }
    }

    this.game = new Phaser.Game(config)
  }

  public endGame(): void {
    const { storeReset } = this.store

    this.game!.destroy(true)
    this.game = null
    storeReset()
  }
}
