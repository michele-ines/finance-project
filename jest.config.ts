import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // ALTERADO: Adicione os mapeamentos de caminho aqui
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^store/(.*)$': '<rootDir>/src/store/$1',
    '^mocks/(.*)$': '<rootDir>/src/mocks/$1'
  },
  preset: 'ts-jest',
}

export default createJestConfig(config)