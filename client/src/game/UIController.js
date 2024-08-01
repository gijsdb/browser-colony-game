import { eventBus } from '@/eventBus';

export default class UIController {
    constructor(scene) {
        this.scene = scene;
    }

    listen() {
        // Listen for events from Vue
        eventBus.value.on('button-click', (data) => {
            console.log('Event received in Phaser:', data);
            this.scene.cameras.main.shake(500);
        });
    }


}