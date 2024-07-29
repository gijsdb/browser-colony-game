import Phaser from 'phaser'
import tiles from '../../assets/tilesets/forest_tiles.png'
import { TerrainGenerator, TILE_VARIANTS } from '../TerrainGenerator'

class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })

        this.terrain_gen = new TerrainGenerator()
        this.targetZoom = 1
        this.zoomSpeed = 0.1
        this.layers = {}
        this.tileSize = 32
        this.mapWidth = 100
        this.mapHeight = 100
    }

    preload() {
        this.load.image('tiles', tiles)
    }

    create() {
        const map = this.make.tilemap({
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
            width: this.mapWidth,
            height: this.mapHeight
        })

        const tileset = map.addTilesetImage('tileset-name', 'tiles')
        this.layers.ground_layer = map.createBlankLayer('Ground', tileset)
        this.layers.resource_layer = map.createBlankLayer('Resource', tileset)

        const terrain = this.terrain_gen.generateTerrainPerlinNoise(this.mapWidth, this.mapHeight)
        const treePositions = this.terrain_gen.addTrees(terrain);

        //render
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileId = terrain[y][x];
                if (this.isTileIdInObject(tileId, TILE_VARIANTS.TERRAIN)) {
                    map.putTileAt(tileId, x, y, false, this.layers.ground_layer);
                } else if (this.isTileIdInObject(tileId, TILE_VARIANTS.RESOURCES)) {
                    map.putTileAt(tileId, x, y, false, this.layers.resource_layer);
                }
            }
        }

        treePositions.forEach(({ x, y }) => {
            this.layers.resource_layer.putTileAt(TILE_VARIANTS.RESOURCES.tree_trunk.id, x, y);
            this.layers.resource_layer.putTileAt(TILE_VARIANTS.RESOURCES.tree_top.id, x, y - 1);
        });

        this.cameras.main.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize)

        this.setInputHandlers(map, terrain)
    }

    isTileIdInObject(tileId, obj) {
        for (const key in obj) {
            if (obj[key].id === tileId) {
                return true;
            }
            if (obj[key] && typeof obj[key] === 'object') {
                if (this.isTileIdInObject(tileId, obj[key])) {
                    return true;
                }
            }
        }
        return false;
    }

    update() {
        const cam = this.cameras.main
        cam.zoom += (this.targetZoom - cam.zoom) * this.zoomSpeed
        if (this.wasd.W.isDown) {
            cam.scrollY -= 10
        } else if (this.wasd.S.isDown) {
            cam.scrollY += 10
        }

        if (this.wasd.A.isDown) {
            cam.scrollX -= 10
        } else if (this.wasd.D.isDown) {
            cam.scrollX += 10
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

            if (groundTile || resourceTile) {
                const tile = groundTile || resourceTile;
                let layerName = 'Ground'
                if (resourceTile != null) {
                    layerName = 'Both'
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

        this.input.on('pointerdown', (pointer) => {
            const tileX = map.worldToTileX(pointer.worldX)
            const tileY = map.worldToTileY(pointer.worldY)
            const tile = map.getTileAt(tileX, tileY)
            if (tile) {
                console.log(`Clicked on tile at ${tileX}, ${tileY}`)
            }
        })

        this.input.on('wheel', (pointer, objects, deltaX, deltaY) => {
            const zoomChange = deltaY * 0.001 // Adjust this value for zoom sensitivity
            this.targetZoom = Phaser.Math.Clamp(this.cameras.main.zoom - zoomChange, 0.5, 3)
        })
    }
}

export default MapScene
