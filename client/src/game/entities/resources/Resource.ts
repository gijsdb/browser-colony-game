export default class Resource {
  public id?: number
  public x: number
  public y: number
  public tilesheetId: number[]
  public toHarvest: boolean
  private harvested: boolean
  private harvestTime: number
  private value: number

  constructor(tilesheetId: number[], x: number, y: number, value: number) {
    this.tilesheetId = tilesheetId
    this.toHarvest = false
    this.harvested = false
    this.harvestTime = 0
    this.x = x
    this.y = y
    this.value = value
  }

  harvest(): number {
    this.toHarvest = false
    this.harvested = true
    this.harvestTime = Date.now()
    console.log('Resource harvested', this)
    return this.value
  }
}
