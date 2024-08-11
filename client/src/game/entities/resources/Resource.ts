export default class Resource {
  public id?: number
  public x: number
  public y: number
  public tilesheetId: number[]
  public toHarvest: boolean
  private harvested: boolean
  private harvestTime: number

  constructor(tilesheetId: number[], x: number, y: number) {
    this.tilesheetId = tilesheetId
    this.toHarvest = false
    this.harvested = false
    this.harvestTime = 0
    this.x = x
    this.y = y
  }

  harvest() {
    this.toHarvest = false
    this.harvested = true
    this.harvestTime = Date.now()
    console.log('Resource harvested', this)
    // give resource values to inventory
  }
}
