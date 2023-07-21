import "reflect-metadata";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

export default {
  bail: true,
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",
  // The test environment that will be used for testing
  testEnvironment: "jest-environment-node",
  // The glob patterns Jest uses to detect test files
  testMatch: ["**/*.spec.ts"],
  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
