import Phaser from 'phaser'
import tiles from '@/assets/tilesets/forest_tiles_fixed.png'
import { TerrainGenerator, TILE_VARIANTS } from '../TerrainGenerator'
import EntityController from '@/game/EntityController'
import UIController from '@/game/UIController'
import CameraController from '@/game/CameraController'
import { isTileIdInObject } from '@/game/util'

class MapScene extends Phaser.Scene {
    constructor(colonistAmount) {
        super({ key: 'MapScene' })

        this.colonistAmount = colonistAmount || 1
        this.layers = {}
        this.tileSize = 32
        this.mapWidth = 100
        this.mapHeight = 100
        this.entityController = null
        this.cameraController = null
        this.terrainGenerator = new TerrainGenerator()
        this.entityController = new EntityController(this)
        this.cameraController = null

        console.log("loading map with colonist amount: ", this.colonistAmount)
    }

    preload() {
        this.load.image('tiles', tiles)
        this.entityController.preload()
    }

    create() {
        const map = this.make.tilemap({
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
            width: this.mapWidth,
            height: this.mapHeight
        })

        const tileset = map.addTilesetImage('tileset-name', 'tiles', 32, 32, 1, 2)
        this.layers.ground_layer = map.createBlankLayer('Ground', tileset)
        this.layers.resource_layer = map.createBlankLayer('Resource', tileset)
        this.layers.decoration_layer = map.createBlankLayer('Decoration', tileset)

        const terrain = this.terrainGenerator.generateTerrainPerlinNoise(this.mapWidth, this.mapHeight)
        this.terrainGenerator.addResources(terrain)
        this.terrainGenerator.addDecoration(terrain)

        this.renderMap(map, terrain)

        this.entityController.createAnimations()
        this.entityController.addButterflies()
        this.entityController.addColonists(this.colonistAmount)

        this.cameraController = new CameraController(this.cameras.main, this.mapWidth, this.mapHeight, this.tileSize, 1, 0.1)

        this.setInputHandlers(map, terrain)

        this.UIController = new UIController(this)
        this.UIController.listen()
    }

    renderMap(map, terrain) {
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileId = terrain[y][x];
                if (isTileIdInObject(tileId, TILE_VARIANTS.TERRAIN)) {
                    map.putTileAt(tileId, x, y, false, this.layers.ground_layer);
                } else if (isTileIdInObject(tileId, TILE_VARIANTS.RESOURCES)) {
                    this.layers.ground_layer.putTileAt(TILE_VARIANTS.TERRAIN.grass.id, x, y)
                    map.putTileAt(tileId, x, y, false, this.layers.resource_layer);
                } else if (isTileIdInObject(tileId, TILE_VARIANTS.DECORATION)) {
                    this.layers.ground_layer.putTileAt(TILE_VARIANTS.TERRAIN.grass.id, x, y)
                    map.putTileAt(tileId, x, y, false, this.layers.decoration_layer);
                }
            }
        }
    }

    update() {
        if (this.cameraController) {
            this.cameraController.update(this.wasd.W.isDown, this.wasd.S.isDown, this.wasd.A.isDown, this.wasd.D.isDown)
        }

        if (this.entityController) {
            this.entityController.update()
        }
    }


    setInputHandlers(map, terrain) {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys('W,S,A,D')

        this.tooltip = this.add
            .text(0, 0, '', {
                fontSize: '16px',
                backgroundColor: '#000',
                color: '#fff',
                padding: { x: 10, y: 5 },
                alpha: 0
            })
            .setOrigin(0.5)

        this.borderGraphics = this.add.graphics()

        this.input.on('pointermove', (pointer) => {
            const tileX = map.worldToTileX(pointer.worldX);
            const tileY = map.worldToTileY(pointer.worldY);

            const groundTile = this.layers.ground_layer.getTileAt(tileX, tileY);
            const resourceTile = this.layers.resource_layer.getTileAt(tileX, tileY);
            const decorationTile = this.layers.decoration_layer.getTileAt(tileX, tileY);

            if (groundTile || resourceTile || decorationTile) {
                const tile = groundTile || resourceTile || decorationTile;
                let layerName = 'Ground'
                if (resourceTile != null) {
                    layerName = 'Resource'
                }
                if (decorationTile != null) {
                    layerName = 'Decoration'
                }
                this.tooltip
                    .setText(`Tile: ${terrain[tileY][tileX]}, x: ${tile.x}, y: ${tile.y} layer: ${layerName}`)
                    .setPosition(pointer.x, pointer.y - 20)
                    .setAlpha(1);
                this.borderGraphics.clear();
                this.borderGraphics.lineStyle(2, 0x00ff00, 1);
                this.borderGraphics.strokeRect(tileX * this.tileSize, tileY * this.tileSize, this.tileSize, this.tileSize); // Use tileSize
            }
            else {
                this.tooltip.setAlpha(0);
                this.borderGraphics.clear();
            }
        })


        this.input.on('pointerout', () => {
            this.tooltip.setAlpha(0)
            this.borderGraphics.clear()
        })


        this.input.on('wheel', (pointer, objects, deltaX, deltaY) => {
            this.cameraController.handleZoom(deltaY)
        })
    }
}

export default MapScene
