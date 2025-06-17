module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  // globalTeardown: 'jest-preset-angular/build/global-teardown.js',
  testMatch: [
    '**/__tests__/**/*.+(ts|js)?(x)',
    '**/?(*.)+(spec|test).+(ts|js)?(x)'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};