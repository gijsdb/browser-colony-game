import Resource from './Resource'

export default class Tree extends Resource {
  private type: string

  constructor(x: number, y: number) {
    super([42, 26], x, y)
    this.type = 'pine'
  }
}
