import { jest } from '@jest/globals'

const eventBusMock = {
  eventBus: {
    value: {
      on: jest.fn(),
      emit: jest.fn()
    }
  }
}

export default eventBusMock
