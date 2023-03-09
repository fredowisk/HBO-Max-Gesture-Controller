import { describe, test, expect, jest } from "@jest/globals";
import {
  supportsWorkerType,
  prepareRunChecker,
} from "../../../../lib/shared/util.js";

global.Worker = class {
  constructor(path, tester) {
    tester.type();
  }

  static terminate() {}
};

describe("SupportsWorkerType test suite", () => {
  test("should return true when capp supportsWorkerType", () => {
    const supports = supportsWorkerType();
    expect(supports).toBeTruthy();
  });
});

describe("PrepareRunChecker test suite", () => {
  test("should return true when call shouldRun with no timer delay", () => {
    const {shouldRun} = prepareRunChecker({ timerDelay: -1 });

    expect(shouldRun()).toBeTruthy();
  });


  test("should return false when call shouldRun with timer delay", () => {
    const {shouldRun} = prepareRunChecker({timerDelay: 1});

    expect(shouldRun()).toBeFalsy();
  })
});
