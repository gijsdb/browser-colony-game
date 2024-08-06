import Phaser from 'phaser';
import MapScene from '../scenes/MapScene';
import EntityController from './EntityController';
import { TerrainController } from './TerrainController';
import UIController from './UIController';
import CameraController from './CameraController';

export default class GameController {
    private game: Phaser.Game | null
    private entityController: EntityController
    private terrainController: TerrainController
    private uiController: UIController
    private cameraController: CameraController

    constructor(colonistAmount: number) {
        this.entityController = new EntityController(colonistAmount);
        this.terrainController = new TerrainController(); 
        this.uiController = new UIController();
        this.cameraController = new CameraController()

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
                    game.scene.add('MapScene', MapScene, true, {entityController: this.entityController, terrainController: this.terrainController, uiController: this.uiController, cameraController: this.cameraController});
                },
                postBoot: (game: Phaser.Game) => {
                    const scene = game.scene.getScene('MapScene') as MapScene;
                    this.provideSceneToControllers(scene);
                }
            }
        };

        this.game = new Phaser.Game(config)
    }

    private provideSceneToControllers(scene: MapScene): void {
        this.entityController.setScene(scene);
        this.uiController.setScene(scene)
        this.cameraController.setScene(scene)
        // Set the scene for other controllers here
    }

    endGame(): void {
        this.game?.destroy(true)
        this.game = null
    }
}