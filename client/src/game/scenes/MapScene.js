import Phaser from 'phaser';
import tiles from "../../assets/tilesets/1.png";
import TerrainGenerator from '../TerrainGenerator';

class MapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.terrain_gen = new TerrainGenerator()
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

        const terrain = this.terrain_gen.generateTerrainPerlinNoise(mapWidth, mapHeight)

        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const tileId = terrain[y][x];
                map.putTileAt(tileId, x, y, false, layer);
            }
        }

        this.cameras.main.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);

        this.setInputHandlers(map, terrain)
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

    setInputHandlers(map, terrain) {
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
                this.borderGraphics.strokeRect(tileX * 32, tileY * 32, 32, 32); // todo dont hard code 32 as tileSize
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
}

export default MapScene;
