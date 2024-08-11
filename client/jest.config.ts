import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^phaser$': '<rootDir>/node_modules/phaser/dist/phaser.js' // Ensure Phaser is resolved correctly
  },
  // If using TypeScript
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
}

export default config
