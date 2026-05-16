import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@components$': '<rootDir>/src/components',
    '^@pages$': '<rootDir>/src/pages',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '\\.(css|module\\.css)$': 'jest-css-modules-transform'
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx']
};

export default config;
