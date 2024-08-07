import Phaser from 'phaser'
import MapScene from '../scenes/MapScene'

export default interface KeyBindings {
  W: Phaser.Input.Keyboard.Key
  S: Phaser.Input.Keyboard.Key
  A: Phaser.Input.Keyboard.Key
  D: Phaser.Input.Keyboard.Key
}

export default class CameraController {
  private scene?: MapScene
  private camera?: Phaser.Cameras.Scene2D.Camera
  private mapWidth?: number
  private mapHeight?: number
  private tileSize?: number
  private targetZoom: number
  private zoomSpeed: number
  private centerXPixels?: number
  private centerYPixels?: number
  private wasd: KeyBindings | undefined
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined

  constructor() {
    this.targetZoom = 1
    this.zoomSpeed = 0.1
  }

  setScene(scene: MapScene): void {
    this.scene = scene as MapScene
    this.camera = this.scene.cameras.main
    this.mapWidth = this.scene.mapWidth
    this.mapHeight = this.scene.mapHeight
    this.tileSize = this.scene.tileSize
    this.centerXPixels = (this.mapWidth * this.tileSize) / 2
    this.centerYPixels = (this.mapHeight * this.tileSize) / 2
    this.camera.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize)
    this.camera.scrollX = this.centerXPixels - this.camera.width / 2
    this.camera.scrollY = this.centerYPixels - this.camera.height / 2
    this.setUpInputHandlers()
  }

  setUpInputHandlers() {
    if (!this.scene!.input.keyboard) {
      throw Error('no keyboard')
    }
    this.cursorKeys = this.scene!.input.keyboard.createCursorKeys()
    this.wasd = this.scene!.input.keyboard.addKeys('W,S,A,D') as KeyBindings
    this.scene?.input.on('wheel', (pointer: any, objects: any, deltaX: number, deltaY: number) => {
      this.handleZoom(deltaY)
    })
  }

  update() {
    if (this.targetZoom > 0.8) {
      this.camera!.zoom += (this.targetZoom - this.camera!.zoom) * this.zoomSpeed
    }
    if (this.wasd?.W.isDown) {
      this.camera!.scrollY -= 15
    } else if (this.wasd?.S.isDown) {
      this.camera!.scrollY += 15
    }

    if (this.wasd?.A.isDown) {
      this.camera!.scrollX -= 15
    } else if (this.wasd?.D.isDown) {
      this.camera!.scrollX += 15
    }
  }

  handleZoom(deltaY: number) {
    const zoomChange = deltaY * 0.001 // Adjust this value for zoom sensitivity
    this.targetZoom = Phaser.Math.Clamp(this.camera!.zoom - zoomChange, 0.5, 3)
  }
}
