import { TILE_VARIANTS } from './TerrainGenerator';
import colonist from '@/assets/characters/colonist.png'
import tiles from '@/assets/tilesets/forest_tiles_fixed.png'

export default class EntityController {
    constructor(scene) {
        this.scene = scene;
        this.colonists = [];
    }

    preload() {
        this.scene.load.image('colonists', colonist)

        this.scene.load.spritesheet('butterfly', tiles, {
            frameWidth: 32,
            frameHeight: 32,
            margin: 1,
            spacing: 2,
        });

        this.scene.load.spritesheet('colonist', colonist, {
            frameWidth: 16,
            frameHeight: 16,
        });
    }

    update() {
        // this.colonists.forEach(colonist => {

        // });
    }

    addColonists(colonistAmount) {
        // const colonistFrames = [
        //     { key: 'colonist_head_left', frame: 0 },  // Head left
        //     { key: 'colonist_head_right', frame: 1 },  // Head right
        //     { key: 'colonist_body_left', frame: 16 },  // Body left
        //     { key: 'colonist_body_right', frame: 17 },  // Body right
        //     { key: 'colonist_legs_left', frame: 32 },  // Legs left
        //     { key: 'colonist_legs_right', frame: 33 }   // Legs right
        // ];
        const colonistFrames = [
            { key: 'colonist_head', frame: [0, 1] },  // Head left
            { key: 'colonist_body', frame: [16, 17] },  // Body left
            { key: 'colonist_legs', frame: [32, 33] },  // Legs left
        ];
        // Create animations for the colonist
        this.scene.anims.create({
            key: 'colonist_walk',
            frames: this.scene.anims.generateFrameNumbers('colonist', { frames: colonistFrames.frames }),
            frameRate: 10,
            repeat: -1
        });
        for (let i = 0; i < colonistAmount; i++) {
            const x = Phaser.Math.Between(0, this.scene.mapWidth - 1) * this.scene.tileSize;
            const y = Phaser.Math.Between(0, this.scene.mapHeight - 1) * this.scene.tileSize;

            const headTopLeft = this.scene.add.sprite(0, 0, 'colonist', 0);
            const headTopRight = this.scene.add.sprite(16, 0, 'colonist', 1);
            const bodyTopLeft = this.scene.add.sprite(0, 16, 'colonist', 16);
            const bodyTopRight = this.scene.add.sprite(16, 16, 'colonist', 17);
            const legsTopLeft = this.scene.add.sprite(0, 32, 'colonist', 32);
            const legsTopRight = this.scene.add.sprite(16, 32, 'colonist', 33);

            const colonist = this.scene.add.container(x, y, [
                headTopLeft,
                headTopRight,
                bodyTopLeft,
                bodyTopRight,
                legsTopLeft,
                legsTopRight
            ]);

            // headTopLeft.play('colonist_head');
            // headTopRight.play('colonist_head');
            // bodyTopLeft.play('colonist_body');
            // bodyTopRight.play('colonist_body');
            // legsTopLeft.play('colonist_legs');
            // legsTopRight.play('colonist_legs');

            this.colonists.push(colonist);
        }
    }

    addButterflies() {
        this.scene.anims.create({
            key: 'fly',
            frames: this.scene.anims.generateFrameNumbers('butterfly', { start: 89, end: 91 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.butterflies = this.scene.add.group();

        for (let i = 0; i < 10; i++) { // Adjust the number of butterflies
            const x = Phaser.Math.Between(0, this.scene.mapWidth * this.scene.tileSize);
            const y = Phaser.Math.Between(0, this.scene.mapHeight * this.scene.tileSize);

            const butterfly = this.scene.butterflies.create(x, y, 'butterfly').play('fly');
            this.animateButterfly(butterfly);
        }
    }

    animateButterfly(butterfly) {
        const duration = Phaser.Math.Between(20000, 50000); // Adjust the duration for movement

        this.scene.tweens.add({
            targets: butterfly,
            x: {
                value: () => Phaser.Math.Between(0, this.scene.mapWidth * this.scene.tileSize),
                duration: duration,

            },
            y: {
                value: () => Phaser.Math.Between(0, this.scene.mapHeight * this.scene.tileSize),
                duration: duration,
            },
            onComplete: () => {
                this.animateButterfly(butterfly);
            }
        });
    }

}