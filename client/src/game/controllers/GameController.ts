import Phaser from 'phaser';
import MapScene from '../scenes/MapScene';
import EntityController from './EntityController';

export default class GameController {
    private game: Phaser.Game | null
    private entityController: EntityController

    constructor(colonistAmount: number) {
        this.entityController = new EntityController();
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: new MapScene(colonistAmount),
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            // parent: container_id, // Set if you need the game placed somewhere specific e.g. inside a div. Without it is added to body
            transparent: true,
            callbacks: {
                preBoot: (game: Phaser.Game) => {
                    game.scene.add('MapScene', MapScene, true, { colonistAmount });
                },
                postBoot: (game: Phaser.Game) => {
                    const scene = game.scene.getScene('MapScene');
                    this.setupControllers(scene);
                }
            }
        };

        this.game = new Phaser.Game(config)
    }

    private setupControllers(scene: Phaser.Scene): void {
        this.entityController.setScene(scene);
        // Set the scene for other controllers here
    }

    endGame(): void {
        this.game?.destroy(true)
        this.game = null
    }
}