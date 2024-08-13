import { jest } from '@jest/globals'
const phaserMock = {
  Game: jest.fn(),
  GameObjects: {
    Sprite: jest.fn().mockImplementation(() => ({
      setOrigin: jest.fn().mockReturnThis(),
      setDepth: jest.fn().mockReturnThis(),
      add: jest.fn()
    })),
    Text: jest.fn().mockImplementation(() => ({
      setOrigin: jest.fn().mockReturnThis()
    })),
    Container: jest.fn().mockImplementation(() => ({
      add: jest.fn()
    }))
  },
  Scene: jest.fn(),
  Math: {
    Between: jest.fn().mockReturnValue(50),
    Distance: {
      Between: jest.fn().mockReturnValue(10)
    }
  }
}

export default phaserMock
