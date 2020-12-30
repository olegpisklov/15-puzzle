export default {
    rootDir: process.cwd(),
    testEnvironment: 'jest-environment-node',
    transform: {},
    moduleFileExtensions: ['js'],
    testMatch: [
        '**/test/**/?(*.)test.js',
    ],
    collectCoverage: true,
    coverageReporters: ['lcov'],
    coveragePathIgnorePatterns: ['<rootDir>/test/'],
    coverageDirectory: '<rootDir>/coverage',
    reporters: ['default']
};
