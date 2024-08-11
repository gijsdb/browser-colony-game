import { createNoise2D } from 'simplex-noise'
import { TerrainGenerator } from './TerrainGenerator' // Adjust the import path as needed
import { TILE_VARIANTS } from './TileVariants' // Adjust the import path as needed

// Mock the createNoise2D function
jest.mock('simplex-noise', () => ({
  createNoise2D: jest.fn().mockReturnValue((x: number, y: number) => {
    console.log('MOCK CALLED')
    // Return different values depending on coordinates
    if (x === 0 && y === 0) return -0.8 // WATER_CENTER
    if (x === 1 && y === 0) return -0.5 // GRASS
    if (x === 0 && y === 1) return 0.2 // DIRT
    return 0.4 // MOUNTAIN
  })
}))

describe('Terrain Generator', () => {
  let tg: TerrainGenerator

  beforeAll(() => {
    tg = new TerrainGenerator()
  })

  it('generates correct terrain based on mocked Perlin noise', () => {
    const width = 2
    const height = 2
    const terrain = tg.generateTerrainPerlinNoise(width, height)
    console.log('TERRAIN', terrain)
    expect(terrain[0][0]).toBe(TILE_VARIANTS.GROUND_LAYER.WATER.WATER_CENTER.TILE_MAP_INDEX)
    expect(terrain[0][1]).toBe(TILE_VARIANTS.GROUND_LAYER.GRASS.TILE_MAP_INDEX)
    expect(terrain[1][0]).toBe(TILE_VARIANTS.GROUND_LAYER.DIRT.TILE_MAP_INDEX)
    expect(terrain[1][1]).toBe(TILE_VARIANTS.GROUND_LAYER.MOUNTAIN.TILE_MAP_INDEX)
  })

  it('calls terrain smoothing, water body removal, and water edges application', () => {
    const width = 2
    const height = 2

    // Spy on the methods to ensure they're called
    const smoothTerrainSpy = jest.spyOn(tg, 'smoothTerrain')
    const removeSmallWaterBodiesSpy = jest.spyOn(tg, 'removeSmallWaterBodies')
    const applyWaterEdgesSpy = jest.spyOn(tg, 'applyWaterEdges')

    tg.generateTerrainPerlinNoise(width, height)

    expect(smoothTerrainSpy).toHaveBeenCalledWith(expect.any(Array), 2)
    expect(removeSmallWaterBodiesSpy).toHaveBeenCalledWith(expect.any(Array), 30)
    expect(applyWaterEdgesSpy).toHaveBeenCalledWith(expect.any(Array))
  })

  //   test('empty string should result in zero', () => {
  //     expect(add('')).toBe(0)
  //   })
})
