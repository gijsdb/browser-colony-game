import Phaser from 'phaser'
import tiles from '@/assets/tilesets/forest_tiles_fixed.png'
import { TerrainController, TILE_VARIANTS } from '@/game/controllers/TerrainController'
import EntityController from '@/game/controllers/EntityController'
import UIController from '@/game/controllers/UIController'
import CameraController from '@/game/controllers/CameraController'
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
        this.terrainController = new TerrainController()
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

        const terrain = this.terrainController.generateTerrainPerlinNoise(this.mapWidth, this.mapHeight)
        this.terrainController.addResources(terrain)
        this.terrainController.addDecoration(terrain)

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


        this.input.on('pointermove', (pointer) => {
            const tileX = map.worldToTileX(pointer.worldX);
            const tileY = map.worldToTileY(pointer.worldY);

            this.UIController.handleTileHoverInfo(tileX, tileY, terrain)
        })

        this.input.on('wheel', (pointer, objects, deltaX, deltaY) => {
            this.cameraController.handleZoom(deltaY)
        })
    }
}

export default MapScene
