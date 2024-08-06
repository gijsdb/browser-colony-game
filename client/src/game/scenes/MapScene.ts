import Phaser from 'phaser'
import tiles from '@/assets/tilesets/forest_tiles_fixed.png'
import { Terrain, TerrainController, TILE_VARIANTS } from '@/game/controllers/TerrainController'
import EntityController from '@/game/controllers/EntityController'
import UIController from '@/game/controllers/UIController'
import CameraController from '@/game/controllers/CameraController'
import { isTileIdInObject } from '@/game/util'

type Layers = {
    ground_layer: Phaser.Tilemaps.TilemapLayer | null
    resource_layer:  Phaser.Tilemaps.TilemapLayer | null
    decoration_layer:  Phaser.Tilemaps.TilemapLayer | null
}

interface KeyBindings {
    W: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  }

class MapScene extends Phaser.Scene {
    public layers: Layers
    public tileSize : number
    public mapWidth : number
    public mapHeight : number
    private entityController? : EntityController
    private cameraController? : CameraController
    private terrainController? : TerrainController
    private uiController? : UIController
    private wasd : KeyBindings | undefined
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined

    constructor() {
        super({ key: 'MapScene' })
       
        this.layers = {
            ground_layer: null,
            resource_layer: null,
            decoration_layer: null
        }
        this.tileSize = 32
        this.mapWidth = 100
        this.mapHeight = 100
        this.wasd = undefined
        this.cursors = undefined
    }   

  

    preload() {
        this.load.image('tiles', tiles)
    }

    create() {
        let data = this.sys.getData()
        const map = this.make.tilemap({
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
            width: this.mapWidth,
            height: this.mapHeight
        })

        this.entityController = data.entityController
        this.terrainController = data.terrainController
        this.uiController = data.uiController
        this.cameraController = data.cameraController

        if (!this.terrainController || !this.entityController || !this.uiController || !this.cameraController) {
            throw Error("no controllers provided")
        }

        const tileset = map.addTilesetImage('tileset-name', 'tiles', 32, 32, 1, 2)
        if (!tileset) {
            throw Error("failed to load tileset")
        }
        this.layers.ground_layer = map.createBlankLayer('Ground', tileset)
        this.layers.resource_layer = map.createBlankLayer('Resource', tileset)
        this.layers.decoration_layer = map.createBlankLayer('Decoration', tileset)
        if (!this.layers.ground_layer || !this.layers.resource_layer || !this.layers.decoration_layer) {
            throw Error("failed to create layers")
        }

        const terrain = this.terrainController.generateTerrainPerlinNoise(this.mapWidth, this.mapHeight)
        this.terrainController.addResources(terrain)
        this.terrainController.addDecoration(terrain)

        this.renderMap(map, terrain)

        this.entityController?.createAnimations()
        this.entityController?.addButterflies()
        this.entityController?.addColonists()

        this.setInputHandlers(map, terrain)
    }

    renderMap(map: Phaser.Tilemaps.Tilemap, terrain: Terrain) {
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileId = terrain[y][x];
                if (isTileIdInObject(tileId, TILE_VARIANTS.TERRAIN)) {
                    map.putTileAt(tileId, x, y, false, this.layers.ground_layer || 0);
                } else if (isTileIdInObject(tileId, TILE_VARIANTS.RESOURCES)) {
                    this.layers.ground_layer?.putTileAt(TILE_VARIANTS.TERRAIN.grass.id, x, y)
                    map.putTileAt(tileId, x, y, false, this.layers.resource_layer || 0);
                } else if (isTileIdInObject(tileId, TILE_VARIANTS.DECORATION)) {
                    this.layers.ground_layer?.putTileAt(TILE_VARIANTS.TERRAIN.grass.id, x, y)
                    map.putTileAt(tileId, x, y, false, this.layers.decoration_layer || 0);
                }
            }
        }
    }

    update() {
        if (this.cameraController) {
            this.cameraController.update(this.wasd?.W.isDown || false, this.wasd?.S.isDown || false, this.wasd?.A.isDown || false, this.wasd?.D.isDown || false)
        } 

        if (this.entityController) {
            this.entityController.update()
        }
    }


    setInputHandlers(map: Phaser.Tilemaps.Tilemap, terrain: Terrain) {
        if (!this.input.keyboard) {
            throw Error("no keyboard")
        }
        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys('W,S,A,D') as KeyBindings


        this.input.on('pointermove', (pointer: any) => {
            const tileX = map.worldToTileX(pointer.worldX);
            const tileY = map.worldToTileY(pointer.worldY);
            if (!tileX || !tileY) {
                throw Error("tile undefined pointermove")
            }

            this.uiController!.handleTileHoverInfo(tileX, tileY, terrain)
        })

        this.input.on('wheel', (pointer: any, objects: any, deltaX: number, deltaY: number) => {
            this.cameraController?.handleZoom(deltaY)
        })
    }
}

export default MapScene
