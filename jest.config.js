const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // next.config.js와 .env 파일을 로드하기 위한 Next.js 앱의 경로
  dir: './',
});

// Jest에 전달할 커스텀 설정
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // 절대 경로 가져오기를 처리
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // TypeScript 파일을 처리할 때 Next.js의 SWC 대신 ts-jest 사용
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_app.tsx',
    '!src/**/_document.tsx',
  ],
};

// createJestConfig는 Next.js에 맞게 설정된 Jset 구성을 반환합니다
// 이를 비동기 함수로 내보냅니다
module.exports = createJestConfig(customJestConfig); 