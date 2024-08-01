import Phaser from 'phaser';
import MapScene from './scenes/MapScene';

export default class GameController {
    constructor(container_id) {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            scene: new MapScene("test"),
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            parent: container_id,
            transparent: true,
        };

        return new Phaser.Game(config);
    }
}