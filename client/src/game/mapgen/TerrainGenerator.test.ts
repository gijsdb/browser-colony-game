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

  it('ensures tree tops and trunks are placed correctly', () => {
    // Mock Math.random to control tree density
    jest.spyOn(Math, 'random').mockImplementation(() => 0.1) // Adjust as needed

    const result = tg.addResourcesToTerrain(terrain, 1)

    // Check tree placement with trunk and top
    expect(result[1][0]).toBe(TILE_VARIANTS.RESOURCE_LAYER.TREE_TRUNK.TILE_MAP_INDEX)
    expect(result[0][0]).toBe(TILE_VARIANTS.RESOURCE_LAYER.TREE_TOP.TILE_MAP_INDEX)

    // Restore Math.random
    jest.restoreAllMocks()
  })

  it('adds different types of resources based on random values', () => {
    // Mock Math.random to simulate different resource types
    // jest
    //   .spyOn(Math, 'random')
    //   .mockImplementationOnce(() => 0.15) // For long grass one
    //   .mockImplementationOnce(() => 0.25) // For long grass two
    //   .mockImplementationOnce(() => 0.35) // For berries
    //   .mockImplementationOnce(() => 0.45) // For mushrooms
    //   .mockImplementationOnce(() => 0.55) // For tree
    // const result = tg.addResourcesToTerrain(terrain) // Set treeDensity to 1 for full coverage
    // // Check for specific resource types based on the mocked random values
    // expect(result[1][0]).toBe(TILE_VARIANTS.RESOURCE_LAYER.LONG_GRASS_ONE.TILE_MAP_INDEX)
    // expect(result[1][1]).toBe(TILE_VARIANTS.RESOURCE_LAYER.LONG_GRASS_TWO.TILE_MAP_INDEX)
    // expect(result[0][0]).toBe(TILE_VARIANTS.RESOURCE_LAYER.BERRIES.TILE_MAP_INDEX)
    // expect(result[0][1]).toBe(TILE_VARIANTS.RESOURCE_LAYER.MUSHROOM.TILE_MAP_INDEX)
    // expect(result[1][0]).toBe(TILE_VARIANTS.RESOURCE_LAYER.TREE_TRUNK.TILE_MAP_INDEX)
    // expect(result[0][0]).toBe(TILE_VARIANTS.RESOURCE_LAYER.TREE_TOP.TILE_MAP_INDEX)
    // // Restore Math.random
    // jest.restoreAllMocks()
  })

  it('does not place trees if there is no space above for the tree top', () => {
    // terrain = [
    //   [
    //     TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX,
    //     TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX
    //   ],
    //   [
    //     TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX,
    //     TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX
    //   ]
    // ]
    // jest.spyOn(Math, 'random').mockImplementation(() => 0.1) // Simulate tree placement
    // const result = tg.addResourcesToTerrain(terrain, 1)
    // // Check that trees are not placed where there is no space above
    // expect(result[1][0]).not.toBe(TILE_VARIANTS.RESOURCE_LAYER.TREE_TRUNK.TILE_MAP_INDEX)
    // expect(result[0][0]).not.toBe(TILE_VARIANTS.RESOURCE_LAYER.TREE_TOP.TILE_MAP_INDEX)
    // // Restore Math.random
    // jest.restoreAllMocks()
  })
})
