module.exports = {
  rootDir: 'src',
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@module/(.*)$': '<rootDir>/modules/$1',
  },
  setupFiles: ['<rootDir>/../test/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/../test/setup-after-env.ts'],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverageFrom: [
    '<rootDir>/src/modules/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.*spec.{js,jsx,ts,tsx}',
    '!<rootDir>/src/main.{js,jsx,ts,tsx}',
    '!<rootDir>/src/module.alias.{js,jsx,ts,tsx}',
    '!<rootDir>/src/modules/**/*.module.ts',
    '!<rootDir>/src/modules/**/infrastructure/database/migrations/**',
  ],
  clearMocks: true,
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/core/'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    },
  },
};
