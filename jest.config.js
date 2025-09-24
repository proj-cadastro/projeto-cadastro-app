module.exports = {
  preset: "react-native",
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/services/**/*.ts",
    "src/utils/**/*.ts",
    "src/validations/**/*.ts",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.(ts|tsx|js)",
    "<rootDir>/src/**/*.test.(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|unimodules|sentry-expo|native-base|react-clone-referenced-element|@react-native-community|expo-linear-gradient|react-native-svg|react-native-vector-icons|react-native-reanimated|react-native-screens|react-native-safe-area-context|react-native-gesture-handler|react-navigation|@react-navigation|react-native-paper|react-native-otp-entry|@react-native-async-storage|react-native-dropdown-picker|axios)/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**/*",
    "!src/**/index.tsx",
    "!src/**/*.test.*",
    "!src/types/**/*",
    "!src/enums/**/*",
    "!src/screens/**/*",
    "!src/components/**/*",
    "!src/context/**/*",
    "!src/routes/**/*",
    "!src/events/**/*",
  ],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 40,
      lines: 50,
      statements: 50,
    },
  },
};
