module.exports = {
  rootDir: 'src',
  testMatch: ['modules/**/tests/*.spec.ts', 'modules/**/tests/*.e2e-spec.ts'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@module/(.*)$': '<rootDir>/modules/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  preset: 'ts-jest',
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
