import Phaser from 'phaser';
import MapScene from '../scenes/MapScene';

export default class GameController {
    constructor(colonistAmount) {
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
        };

        this.game = new Phaser.Game(config)
    }

    endGame() {
        this.game.destroy(true)
        this.game = null
    }
}