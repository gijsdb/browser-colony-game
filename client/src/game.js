import Phaser from 'phaser';
import { createNoise2D } from 'simplex-noise';
import tiles from "./assets/forest_tiles.png"

const TILE_VARIANTS = {
    grass: {
        id: 0,
    },
    dirt: {
        id: 5,
    },
    mountain: {
        id: 23,
    },
    water: {
        id: 133,
    }
}

export function createPhaserGame(containerId) {
    console.log("CREATING GAME")
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: {
            preload,
            create,
            resize
        },
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        parent: containerId
    };

    return new Phaser.Game(config);
}

function preload() {
    this.load.image('tiles', tiles);
}

function generateTerrain(width, height) {
    //simplex noise
    const noise = createNoise2D()
    const terrain = [];
    for (let y = 0; y < height; y++) {
        terrain[y] = [];
        for (let x = 0; x < width; x++) {
            const value = noise(x / 10, y / 10); // Adjust the scale for noise
            if (value < -0.3) {
                terrain[y][x] = TILE_VARIANTS.water.id;
            } else if (value < 0) {
                terrain[y][x] = TILE_VARIANTS.grass.id
            } else if (value < 0.5) {
                terrain[y][x] = TILE_VARIANTS.dirt.id
            } else {
                terrain[y][x] = TILE_VARIANTS.mountain.id
            }
        }
    }
    return terrain;
}

function create() {
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

    const terrain = generateTerrain(mapWidth, mapHeight);

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const tileId = terrain[y][x];
            map.putTileAt(tileId, x, y, false, layer);
        }
    }

    this.cameras.main.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);

    this.input.on('pointerdown', (pointer) => {
        this.cameras.main.startFollow(pointer, true);
    });

    this.input.on('pointerup', (pointer) => {
        this.cameras.main.stopFollow();
    });

    this.input.on('pointermove', (pointer) => {
        if (pointer.isDown) {
            const camera = this.cameras.main;
            camera.scrollX -= pointer.movementX;
            camera.scrollY -= pointer.movementY;
        }
    });

    this.input.on('pointerdown', (pointer) => {
        const tileX = map.worldToTileX(pointer.worldX);
        const tileY = map.worldToTileY(pointer.worldY);
        const tile = map.getTileAt(tileX, tileY);
        if (tile) {
            console.log(`Clicked on tile at ${tileX}, ${tileY}`);
        }
    });
}

function resize() {
    this.cameras.resize(window.innerWidth, window.innerHeight);
}