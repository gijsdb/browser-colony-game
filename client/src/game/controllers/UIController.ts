import { eventBus } from '@/eventBus';
import { Terrain } from './TerrainController';
import MapScene from '../scenes/MapScene';

export default class UIController {
    private scene: MapScene | null
    private tileBorderGraphics: Phaser.GameObjects.Graphics | null

    constructor() {
        this.scene = null;
        this.tileBorderGraphics = null
    }

    setScene(scene: MapScene): void {
        this.scene = scene as MapScene;
        this.listen()
    }

    // Listen for events from Vue
    listen() {
        eventBus.value.on('button-click', (data) => {
            console.log('Event received in Phaser:', data);
            this.scene!.cameras.main.shake(500);
        });

        eventBus.value.on('button-order-woodcut', (data) => {
            console.log('Event received in Phaser:', data);
            this.scene!.cameras.main.shake(500);
        });        
    }

    setUpInputListeners() {
        
    }

    handleTileHoverInfo(tileX: number, tileY: number, terrain: Terrain) {
        if (!this.tileBorderGraphics) {
            this.tileBorderGraphics = this.scene!.add.graphics()
        }
        const groundTile = this.scene!.layers.ground_layer?.getTileAt(tileX, tileY);
        const resourceTile = this.scene!.layers.resource_layer?.getTileAt(tileX, tileY);
        const decorationTile = this.scene!.layers.decoration_layer?.getTileAt(tileX, tileY);


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
                tileX: tile?.x,
                tileY: tile?.y,
                type: terrain[tileY][tileX],
                layer: layerName
            }) 
            this.tileBorderGraphics.clear();
            this.tileBorderGraphics.lineStyle(2, 0x00ff00, 1);
            this.tileBorderGraphics.strokeRect(tileX * 32, tileY * 32, 32, 32); 
        }
        else {
            this.tileBorderGraphics.clear();
        }

    }

}