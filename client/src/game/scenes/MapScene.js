import Phaser from 'phaser';
import { createNoise2D } from 'simplex-noise';
import tiles from "../../assets/tilesets/1.png";

const TILE_VARIANTS = {
    grass: { id: 16 },
    dirt: { id: 156 },
    mountain: { id: 291 },
    water: { id: 106 },
    water_edge_top: { id: 46 },
    water_edge_bottom: { id: 76 },
    water_edge_left: { id: 60 },
    water_edge_right: { id: 62 },
    water_corner_topleft: { id: 45 },
    water_corner_topright: { id: 47 },
    water_corner_bottomleft: { id: 75 },
    water_corner_bottomright: { id: 77 }
};

class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.targetZoom = 1;
        this.zoomSpeed = 0.1;
    }

    preload() {
        this.load.image('tiles', tiles);
    }

    create() {
        const mapWidth = 100;
        const mapHeight = 100;
        const tileSize = 32;

        const map = this.make.tilemap({
            tileWidth: tileSize,
            tileHeight: tileSize,
            width: mapWidth,
            height: mapHeight
        });

        const tileset = map.addTilesetImage('tileset-name', 'tiles');
        const layer = map.createBlankLayer('Ground', tileset);

        const terrain = this.generateTerrain(mapWidth, mapHeight);

        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const tileId = terrain[y][x];
                map.putTileAt(tileId, x, y, false, layer);
            }
        }

        this.cameras.main.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');

        this.tooltip = this.add.text(0, 0, '', {
            fontSize: '16px',
            backgroundColor: '#000',
            color: '#fff',
            padding: { x: 10, y: 5 },
            alpha: 0
        }).setOrigin(0.5);

        this.borderGraphics = this.add.graphics();

        this.input.on('pointermove', (pointer) => {
            const tileX = map.worldToTileX(pointer.worldX);
            const tileY = map.worldToTileY(pointer.worldY);
            const tile = map.getTileAt(tileX, tileY);

            if (tile) {
                this.tooltip.setText(`Tile: ${terrain[tileY][tileX]}, x: ${tile.x}, y ${tile.y}`)
                    .setPosition(pointer.x, pointer.y - 20)
                    .setAlpha(1);

                this.borderGraphics.clear();
                this.borderGraphics.lineStyle(2, 0x00ff00, 1);
                this.borderGraphics.strokeRect(tileX * tileSize, tileY * tileSize, tileSize, tileSize);
            } else {
                this.tooltip.setAlpha(0);
                this.borderGraphics.clear();
            }
        });

        this.input.on('pointerout', () => {
            this.tooltip.setAlpha(0);
            this.borderGraphics.clear();
        });

        this.input.on('pointerdown', (pointer) => {
            const tileX = map.worldToTileX(pointer.worldX);
            const tileY = map.worldToTileY(pointer.worldY);
            const tile = map.getTileAt(tileX, tileY);
            if (tile) {
                console.log(`Clicked on tile at ${tileX}, ${tileY}`);
            }
        });
        this.input.on('wheel', (pointer, objects, deltaX, deltaY) => {
            const zoomChange = deltaY * 0.001; // Adjust this value for zoom sensitivity
            this.targetZoom = Phaser.Math.Clamp(this.cameras.main.zoom - zoomChange, 0.5, 3);
        });
    }

    update() {

        const cam = this.cameras.main;
        cam.zoom += (this.targetZoom - cam.zoom) * this.zoomSpeed;
        if (this.wasd.W.isDown) {
            cam.scrollY -= 10;
        } else if (this.wasd.S.isDown) {
            cam.scrollY += 10;
        }

        if (this.wasd.A.isDown) {
            cam.scrollX -= 10;
        } else if (this.wasd.D.isDown) {
            cam.scrollX += 10;
        }
    }

    generateTerrain(width, height) {
        const noise = createNoise2D();
        const terrain = [];
        for (let y = 0; y < height; y++) {
            terrain[y] = [];
            for (let x = 0; x < width; x++) {
                const value = noise(x / 20, y / 20);
                if (value < -0.7) {
                    terrain[y][x] = TILE_VARIANTS.water.id;
                } else if (value < 0) {
                    terrain[y][x] = TILE_VARIANTS.grass.id;
                } else if (value < 0.5) {
                    terrain[y][x] = TILE_VARIANTS.dirt.id;
                } else {
                    terrain[y][x] = TILE_VARIANTS.mountain.id;
                }
            }
        }

        this.applyWaterEdges(terrain);

        return terrain;
    }

    applyWaterEdges(terrain) {
        for (let y = 0; y < terrain.length; y++) {
            for (let x = 0; x < terrain[y].length; x++) {
                if (terrain[y][x] === TILE_VARIANTS.water.id) {
                    terrain[y][x] = this.getWaterEdgeTile(terrain, x, y);
                }
            }
        }
    }

    getTile(terrain, x, y) {
        if (x < 0 || y < 0 || x >= terrain[0].length || y >= terrain.length) {
            return null;
        }
        return terrain[y][x];
    }

    // WIP
    getWaterEdgeTile(terrain, x, y) {
        const isWater = (x, y) => this.getTile(terrain, x, y) === TILE_VARIANTS.water.id;

        const top = isWater(x, y - 1);
        const bottom = isWater(x, y + 1);
        const left = isWater(x - 1, y);
        const right = isWater(x + 1, y);

        const topLeft = isWater(x - 1, y - 1);
        const topRight = isWater(x + 1, y - 1);
        const bottomLeft = isWater(x - 1, y + 1);
        const bottomRight = isWater(x + 1, y + 1);

        if (top && left && !topLeft) return TILE_VARIANTS.water_corner_topleft.id;
        if (top && right && !topRight) return TILE_VARIANTS.water_corner_topright.id;
        if (bottom && left && !bottomLeft) return TILE_VARIANTS.water_corner_bottomleft.id;
        if (bottom && right && !bottomRight) return TILE_VARIANTS.water_corner_bottomright.id;

        if (top && !left && !right) return TILE_VARIANTS.water_edge_top.id;
        if (bottom && !left && !right) return TILE_VARIANTS.water_edge_bottom.id;
        if (left && !top && !bottom) return TILE_VARIANTS.water_edge_left.id;
        if (right && !top && !bottom) return TILE_VARIANTS.water_edge_right.id;

        return TILE_VARIANTS.water.id;
    }
}

export default MapScene;
