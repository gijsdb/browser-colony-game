export default class Resource {
  private tilesheetId: number[]
  public x: number
  public y: number
  public harvest: boolean
  private harvested: boolean
  private harvestTime: number

  constructor(tilesheetId: number[], x: number, y: number) {
    this.tilesheetId = tilesheetId
    this.harvest = false
    this.harvested = false
    this.harvestTime = 0
    this.x = x
    this.y = y
  }
}
