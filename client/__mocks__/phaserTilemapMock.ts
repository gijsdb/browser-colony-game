import { jest } from '@jest/globals'

const phaserTilemapMock = {
  getTileAt: jest.fn().mockReturnValue({
    index: 0 // Mocked tile index for GRASS
  })
}

export default phaserTilemapMock
