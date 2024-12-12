/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
  testMatch: [
    "**/?(*.)+(spec|test|unit).[jt]s?(x)", // Matches unit tests only
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  clearMocks: true,
  setupFilesAfterEnv: ["./tests/setup/jest.setup.js"], // Ensure this is valid
};
