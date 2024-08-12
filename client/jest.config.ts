import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // '^@$': '<rootDir>/src',
    // '^@/(.*)\\.(?!jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    //   '<rootDir>/src/$1',
    '^@$': '<rootDir>/src/$1',

    '^@/(.*)\\.(?!jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/$1',

    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.ts',

    '^phaser$': '<rootDir>/node_modules/phaser/dist/phaser.js' // Ensure Phaser is resolved correctly
  },
  // If using TypeScript
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  setupFiles: ['jest-canvas-mock']
}

export default config
