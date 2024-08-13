import { jest } from '@jest/globals'

const phaserSceneMock = {
  add: {
    sprite: jest.fn().mockReturnValue({
      setOrigin: jest.fn().mockReturnThis(),
      setDepth: jest.fn().mockReturnThis(),
      add: jest.fn()
    }),
    text: jest.fn().mockReturnValue({
      setOrigin: jest.fn().mockReturnThis()
    }),
    container: jest.fn().mockReturnValue({
      add: jest.fn()
    })
  },
  anims: {
    create: jest.fn(),
    generateFrameNumbers: jest.fn().mockReturnValue([])
  }
}

export default phaserSceneMock
