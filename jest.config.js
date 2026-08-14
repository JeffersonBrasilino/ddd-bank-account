module.exports = {
  rootDir: 'src',
  testMatch: [
    'modules/**/tests/*.spec.ts',
    'modules/**/tests/*.e2e-spec.ts',
    'core/application/**/*.spec.ts',
    'core/domain/**/*.spec.ts',
    'core/infrastructure/**/*.spec.ts',
  ],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@module/(.*)$': '<rootDir>/modules/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/../test/jest-env.setup.js'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
  collectCoverageFrom: [
    '<rootDir>/modules/**/domain/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/modules/**/domain/*.{js,jsx,ts,tsx}',
    '<rootDir>/modules/**/application/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/modules/**/application/*.{js,jsx,ts,tsx}',
    '<rootDir>/modules/**/infrastructure/http/*.{js,jsx,ts,tsx}',
    '<rootDir>/modules/**/infrastructure/http/**/*.{js,jsx,ts,tsx}',
  ],
  clearMocks: true,
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    },
  },
};
