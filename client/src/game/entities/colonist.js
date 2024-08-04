import { generateColonistName } from "../util";

export default class Colonist {
    constructor(scene, x, y) {
        this.scene = scene
        this.x = x
        this.y = y
        this.name = generateColonistName()

        this.headTopLeft = this.scene.add.sprite(0, 0, 'colonist', 0);
        this.headTopRight = this.scene.add.sprite(16, 0, 'colonist', 1);
        this.bodyTopLeft = this.scene.add.sprite(0, 16, 'colonist', 16);
        this.bodyTopRight = this.scene.add.sprite(16, 16, 'colonist', 17);
        this.legsTopLeft = this.scene.add.sprite(0, 32, 'colonist', 32);
        this.legsTopRight = this.scene.add.sprite(16, 32, 'colonist', 33);
        this.nameTag = this.scene.add.text(-13, 35, this.name, {
            fontSize: 13,
            strokeThickness: 0.5
        })

        this.container = this.scene.add.container(this.x * this.scene.tileSize, this.y * this.scene.tileSize, [
            this.headTopLeft,
            this.headTopRight,
            this.bodyTopLeft,
            this.bodyTopRight,
            this.legsTopLeft,
            this.legsTopRight,
            this.nameTag
        ]);
    }
}