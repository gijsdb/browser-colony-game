import { Terrain, TerrainGenerator } from './TerrainGenerator'
import { TILE_VARIANTS } from './TileVariants'

jest.mock('simplex-noise', () => ({
  createNoise2D: jest.fn().mockReturnValue((x: number, y: number) => {
    // divided by 35 in terrainGenerator.generateTerrainPerlinNoise so revert to make it easier to deal with
    x = x * 35
    y = y * 35
    if (x === 0 && y === 0) return -0.8 // WATER_CENTER
    if (x === 0 && y === 1) return 0.2 // GRASS
    if (x === 1 && y === 0) return -0.5 // GRASS
    if (x === 1 && y === 1) return 0.4 // DIRT
  })
}))

describe('generateTerrainPerlinNoise', () => {
  let tg: TerrainGenerator

  beforeEach(() => {
    tg = new TerrainGenerator()
  })

  it('generates terrain based on perlin noise', () => {
    const width = 2
    const height = 2
    const terrain = tg.generateTerrainPerlinNoise(width, height)

    expect(terrain[0][0]).toBe(TILE_VARIANTS.GROUND_LAYER.WATER.WATER_CENTER.TILE_MAP_INDEX)
    expect(terrain[0][1]).toBe(TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX)
    expect(terrain[1][0]).toBe(TILE_VARIANTS.GROUND_LAYER.DIRT.TILE_MAP_INDEX)
    expect(terrain[1][1]).toBe(TILE_VARIANTS.GROUND_LAYER.MOUNTAIN.TILE_MAP_INDEX)
  })
})

describe('addResourcesToTerrain', () => {
  let tg: TerrainGenerator
  let terrain: Terrain

  beforeEach(() => {
    tg = new TerrainGenerator()
    terrain = [
      [
        TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX,
        TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX
      ],
      [
        TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX,
        TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX
      ]
    ]
  })

  it('does not add resources if treeDensity is 0', () => {
    const result = tg.addResourcesToTerrain(terrain, 0)
    expect(result).toEqual(terrain)
  })
})
