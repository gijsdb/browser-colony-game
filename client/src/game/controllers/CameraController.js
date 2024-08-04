import Phaser from 'phaser'

export default class CameraController {
    constructor(camera, mapWidth, mapHeight, tileSize, targetZoom, zoomSpeed) {
        this.camera = camera
        this.mapWidth = mapWidth
        this.mapHeight = mapHeight
        this.tileSize = tileSize
        this.targetZoom = targetZoom
        this.zoomSpeed = zoomSpeed
        this.centerXPixels = (this.mapWidth * this.tileSize) / 2
        this.centerYPixels = (this.mapHeight * this.tileSize) / 2

        this.camera.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize)
        this.camera.scrollX = this.centerXPixels - (this.camera.width / 2)
        this.camera.scrollY = this.centerYPixels - (this.camera.height / 2)
    }

    update(wDown, sDown, aDown, dDown) {
        if (this.targetZoom > 0.8) {
            this.camera.zoom += (this.targetZoom - this.camera.zoom) * this.zoomSpeed

        }
        if (wDown) {
            this.camera.scrollY -= 15
        } else if (sDown) {
            this.camera.scrollY += 15
        }

        if (aDown) {
            this.camera.scrollX -= 15
        } else if (dDown) {
            this.camera.scrollX += 15
        }
    }

    handleZoom(deltaY) {
        const zoomChange = deltaY * 0.001 // Adjust this value for zoom sensitivity
        this.targetZoom = Phaser.Math.Clamp(this.camera.zoom - zoomChange, 0.5, 3)
    }

}

