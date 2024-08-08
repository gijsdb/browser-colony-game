export default class Resource {
  private tilesheetId: number[]
  private x: number
  private y: number
  private harvested: boolean
  private harvestTime: number

  constructor(tilesheetId: number[], x: number, y: number) {
    this.tilesheetId = tilesheetId
    this.harvested = false
    this.harvestTime = 0
    this.x = x
    this.y = y
  }

  harvest() {
    this.harvested = true
    this.harvestTime = Date.now()
  }
}
