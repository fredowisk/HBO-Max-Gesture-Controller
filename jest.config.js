module.exports = {
  roots: ["<rootDir>/tests"],
  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  testEnvironment: "jsdom",

  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  maxWorkers: "80%",
};
