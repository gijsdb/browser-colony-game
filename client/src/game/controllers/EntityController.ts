import Phaser from 'phaser'
import { TILE_VARIANTS } from '@/game/controllers/TerrainController';
import Colonist from '@/game/entities/colonist';
import tiles_img from '@/assets/tilesets/forest_tiles_fixed.png'
import colonist_img from '@/assets/characters/colonist.png'
import MapScene from '../scenes/MapScene';


export default class EntityController {
    private scene : MapScene | null
    private colonistAmount: number
    private colonists: Array<Colonist>
    private butterflies: Phaser.GameObjects.Group | undefined

    constructor(colonistAmount: number) {
        this.scene = null;
        this.colonists = [];
        this.butterflies = undefined
        this.colonistAmount = colonistAmount
    }

    setScene(scene: MapScene): void {
        this.scene = scene as MapScene;
        this.preload()
    }

    preload() {
        this.scene?.load.image('colonists', colonist_img)

        this.scene?.load.spritesheet('butterfly', tiles_img, {
            frameWidth: 32,
            frameHeight: 32,
            margin: 1,
            spacing: 2,
        });

        this.scene?.load.spritesheet('colonist', colonist_img, {
            frameWidth: 16,
            frameHeight: 16,
        });
    }

    update() {

    }

    addColonists() {
        const centerX = Math.floor(this.scene!.mapWidth / 2);
        const centerY = Math.floor(this.scene!.mapHeight / 2);
        const spawnRadius = 10
        for (let i = 0; i < this.colonistAmount; i++) {
            let x, y
            do {
                x = Phaser.Math.Between(centerX - spawnRadius, centerX + spawnRadius);
                y = Phaser.Math.Between(centerY - spawnRadius, centerY + spawnRadius);
                if (this.scene!.layers.ground_layer?.getTileAt(x, y).index != TILE_VARIANTS.TERRAIN.grass.id) {
                    x = null
                    y = null
                }
            } while (x == null && y == null)

            const colonist = new Colonist(this.scene!, x || 0, y || 0);
            this.colonists.push(colonist);
        }
    }

    addButterflies() {
        this.butterflies = this.scene!.add.group();
        for (let i = 0; i < 10; i++) { // Adjust the number of butterflies
            const x = Phaser.Math.Between(0, this.scene!.mapWidth * this.scene!.tileSize);
            const y = Phaser.Math.Between(0, this.scene!.mapHeight * this.scene!.tileSize);

            const butterfly = this.butterflies.create(x, y, 'butterfly').play('fly');
            this.addButterflyMovement(butterfly);
        }
    }

    addButterflyMovement(butterfly: any) {
        const duration = Phaser.Math.Between(20000, 50000); // Adjust the duration for movement

        this.scene!.tweens.add({
            targets: butterfly,
            x: {
                value: () => Phaser.Math.Between(0, this.scene!.mapWidth * this.scene!.tileSize),
                duration: duration,

            },
            y: {
                value: () => Phaser.Math.Between(0, this.scene!.mapHeight * this.scene!.tileSize),
                duration: duration,
            },
            onComplete: () => {
                this.addButterflyMovement(butterfly);
            }
        });
    }

    createAnimations() {
        this.scene!.anims.create({
            key: 'fly',
            frames: this.scene!.anims.generateFrameNumbers('butterfly', { start: 89, end: 91 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene!.anims.create({
            key: 'colonist_walk_head_left',
            frames: this.scene!.anims.generateFrameNumbers('colonist', { frames: [0, 2, 4, 6, 8, 10, 12, 14] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene!.anims.create({
            key: 'colonist_walk_head_right',
            frames: this.scene!.anims.generateFrameNumbers('colonist', { frames: [1, 3, 5, 7, 9, 11, 13, 15] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene!.anims.create({
            key: 'colonist_walk_body_left',
            frames: this.scene!.anims.generateFrameNumbers('colonist', { frames: [16, 18, 20, 22, 24, 26, 28, 30] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene!.anims.create({
            key: 'colonist_walk_body_right',
            frames: this.scene!.anims.generateFrameNumbers('colonist', { frames: [17, 19, 21, 23, 25, 27, 29, 31] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene!.anims.create({
            key: 'colonist_walk_legs_left',
            frames: this.scene!.anims.generateFrameNumbers('colonist', { frames: [32, 34, 36, 38, 40, 42, 44, 46] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene!.anims.create({
            key: 'colonist_walk_legs_right',
            frames: this.scene!.anims.generateFrameNumbers('colonist', { frames: [33, 35, 37, 39, 41, 43, 45, 47] }),
            frameRate: 10,
            repeat: -1
        });
    }
}