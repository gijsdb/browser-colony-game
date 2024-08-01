export default class EntityController {
    constructor(scene) {
        this.scene = scene;
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