import { describe, test, expect, jest } from "@jest/globals";
import HandGestureController from "../../../../pages/titles/src/controllers/handGestureController.js";

jest.mock("../../../../pages/titles/src/util/util.js", () => ({
  fingerLookupIndexes: {},
  knownGestures: {},
}));

jest.mock(
  "../../../../lib/shared/camera.js",
  () =>
    class {
      static async init() {}
    }
);

jest.mock(
  "../../../../pages/titles/src/controllers/handGestureController.js",
  () =>
    class {
      static async initialize() {}
    }
);
jest.mock(
  "../../../../pages/titles/src/views/handGestureView.js",
  () => class {}
);
jest.mock(
  "../../../../pages/titles/src/services/handGestureService.js",
  () => class {}
);

window.PseudoStyler = class {};

describe("Hand Gesture Factory test suite", () => {
  test("should call HandGestureController.initialize when call factory.initialize", async () => {
    const { default: factory } = await import(
      "../../../../pages/titles/src/factories/handGestureFactory.js"
    );

    const spyInitialize = jest.spyOn(HandGestureController, "initialize");

    await factory.initialize();

    expect(spyInitialize).toHaveBeenCalled();
  });
});
