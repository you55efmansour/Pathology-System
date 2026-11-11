module.exports = { testEnvironment: 'jsdom', roots: ['<rootDir>/src'], moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }, transform: { '^.+\\.[jt]sx?$': 'babel-jest' } };
