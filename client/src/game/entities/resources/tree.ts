import Resource from './resource'

export default class Tree extends Resource {
  private type: string

  constructor(x: number, y: number) {
    super([42, 26], x, y)
    this.type = 'pine'
  }
}
