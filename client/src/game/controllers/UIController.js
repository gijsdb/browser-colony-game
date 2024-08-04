import { eventBus } from '@/eventBus';

export default class UIController {
    constructor(scene) {
        this.scene = scene;
        this.borderGraphics = this.scene.add.graphics()
    }

    // Listen for events from Vue
    listen() {
        eventBus.value.on('button-click', (data) => {
            console.log('Event received in Phaser:', data);
            this.scene.cameras.main.shake(500);
        });
    }

    handleTileHoverInfo(tileX, tileY, terrain) {
        const groundTile = this.scene.layers.ground_layer.getTileAt(tileX, tileY);
        const resourceTile = this.scene.layers.resource_layer.getTileAt(tileX, tileY);
        const decorationTile = this.scene.layers.decoration_layer.getTileAt(tileX, tileY);


        if (groundTile || resourceTile || decorationTile) {
            const tile = groundTile || resourceTile || decorationTile;
            let layerName = 'Ground'
            if (resourceTile != null) {
                layerName = 'Resource'
            }
            if (decorationTile != null) {
                layerName = 'Decoration'
            }

            eventBus.value.emit('hover-info',  {
                tileX: tile.x,
                tileY: tile.y,
                type: terrain[tileY][tileX],
                layer: layerName
            }) 
            this.borderGraphics.clear();
            this.borderGraphics.lineStyle(2, 0x00ff00, 1);
            this.borderGraphics.strokeRect(tileX * 32, tileY * 32, 32, 32); 
        }
        else {
            this.borderGraphics.clear();
        }

    }

}