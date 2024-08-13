import Resource from './Resource'

export default class Mushroom extends Resource {
  constructor(x: number, y: number) {
    super([13], x, y, 10)
  }
}
