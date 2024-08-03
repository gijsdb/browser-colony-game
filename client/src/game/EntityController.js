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
        this.scene.anims.create({
            key: 'colonist_walk_head_left',
            frames: this.scene.anims.generateFrameNumbers('colonist', { frames: [0, 2, 4, 6, 8, 10, 12, 14] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'colonist_walk_head_right',
            frames: this.scene.anims.generateFrameNumbers('colonist', { frames: [1, 3, 5, 7, 9, 11, 13, 15] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'colonist_walk_body_left',
            frames: this.scene.anims.generateFrameNumbers('colonist', { frames: [16, 18, 20, 22, 24, 26, 28, 30] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'colonist_walk_body_right',
            frames: this.scene.anims.generateFrameNumbers('colonist', { frames: [17, 19, 21, 23, 25, 27, 29, 31] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'colonist_walk_legs_left',
            frames: this.scene.anims.generateFrameNumbers('colonist', { frames: [32, 34, 36, 38, 40, 42, 44, 46] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'colonist_walk_legs_right',
            frames: this.scene.anims.generateFrameNumbers('colonist', { frames: [33, 35, 37, 39, 41, 43, 45, 47] }),
            frameRate: 10,
            repeat: -1
        });

        for (let i = 0; i < colonistAmount; i++) {
            const x = Phaser.Math.Between(0, this.scene.mapWidth - 1) * this.scene.tileSize;
            const y = Phaser.Math.Between(0, this.scene.mapHeight - 1) * this.scene.tileSize;

            const headLeft = this.scene.add.sprite(0, 0, 'colonist', 0);
            const headRight = this.scene.add.sprite(16, 0, 'colonist', 1);
            const bodyLeft = this.scene.add.sprite(0, 16, 'colonist', 16);
            const bodyRight = this.scene.add.sprite(16, 16, 'colonist', 17);
            const legsLeft = this.scene.add.sprite(0, 32, 'colonist', 32);
            const legsRight = this.scene.add.sprite(16, 32, 'colonist', 33);

            const colonist = this.scene.add.container(x, y, [
                headLeft,
                headRight,
                bodyLeft,
                bodyRight,
                legsLeft,
                legsRight
            ]);

            headLeft.play('colonist_walk_head_left');
            headRight.play('colonist_walk_head_right');
            bodyLeft.play('colonist_walk_body_left');
            bodyRight.play('colonist_walk_body_right');
            legsLeft.play('colonist_walk_legs_left');
            legsRight.play('colonist_walk_legs_right');

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