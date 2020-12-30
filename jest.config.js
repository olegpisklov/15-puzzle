export default {
    rootDir: process.cwd(),
    testEnvironment: 'jest-environment-node',
    transform: {},
    moduleFileExtensions: ['js'],
    testMatch: [
        '**/tests/**/?(*.)test.js',
    ],
    collectCoverage: true,
    coverageReporters: ['lcov'],
    coveragePathIgnorePatterns: ['<rootDir>/tests/'],
    coverageDirectory: '<rootDir>/coverage',
    reporters: ['default']
};
