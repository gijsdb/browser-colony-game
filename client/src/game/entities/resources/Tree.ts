import Resource from './Resource'

export default class Tree extends Resource {
  constructor(x: number, y: number) {
    super([42, 26], x, y, 30)
  }
}
