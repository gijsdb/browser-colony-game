import Resource from './resource'

export default class Tree extends Resource {
  private type: string
  constructor() {
    super()

    this.type = 'pine'
  }
}
