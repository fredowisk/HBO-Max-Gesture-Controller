import { describe, test, jest, expect } from "@jest/globals";
import HandGestureController from "../../../../pages/titles/src/controllers/handGestureController.js";

jest.mock("../../../../lib/shared/util.js", () => ({
  prepareRunChecker: () => ({
    shouldRun: () => true,
  }),
}));

console = {
  log: () => {},
  error: jest.fn(),
};

const viewStub = {
  scaleContext: jest.fn(),
  clearCanvas: jest.fn(),
  drawResults: jest.fn(),
  clickOnElement: jest.fn(),
  scrollPage: jest.fn(),
  loop: jest.fn(),
  getCurrentPagePosition: jest.fn().mockReturnValue(200),
  totalHeight: 1080,
};

const gestureMock = { handedness: "Left", event: "click", x: 1, y: 1 };

function* detectGesturesMock() {
  yield gestureMock;
}

const serviceStub = {
  estimateHands: jest.fn().mockResolvedValue([1]),
  detectGestures: detectGesturesMock,
  initializeDetector: jest.fn(),
};

const cameraStub = {
  video: {
    videoWidth: 1080,
  },
};

describe("Hand Gesture Controller test suite", () => {
  const controllerDependenciesMock = {
    view: viewStub,
    service: serviceStub,
    camera: cameraStub,
  };

  test("should call init when call initialize", () => {
    const initSpy = jest
      .spyOn(HandGestureController.prototype, "init")
      .mockReturnValueOnce();

    HandGestureController.initialize(controllerDependenciesMock);

    expect(initSpy).toHaveBeenCalled();
  });

  test("should call scaleContext when call init with a low quality video", async () => {
    cameraStub.video.videoWidth = 720;
    const controller = new HandGestureController(controllerDependenciesMock);

    await controller.init();

    expect(viewStub.getCurrentPagePosition).toHaveBeenCalled();
    expect(viewStub.scaleContext).toHaveBeenCalled();
    expect(serviceStub.initializeDetector).toHaveBeenCalled();
    expect(viewStub.loop).toHaveBeenCalled();
    expect(viewStub.clickOnElement).toHaveBeenCalled();
  });

  test("should call scrollDown when call scrollHandler with scroll-down event", async () => {
    cameraStub.video.videoWidth = 1080;
    gestureMock.handedness = "Right";
    gestureMock.event = "scroll-down";

    const expectedLastDirection = 400;

    const controller = new HandGestureController(controllerDependenciesMock);

    await controller.init();

    expect(serviceStub.initializeDetector).toHaveBeenCalled();
    expect(viewStub.loop).toHaveBeenCalled();
    expect(viewStub.scrollPage).toHaveBeenCalledWith(expectedLastDirection);
  });

  test("should call scrollUp when call scrollHandler with scroll-up event", async () => {
    gestureMock.handedness = "Right";
    gestureMock.event = "scroll-up";

    const expectedLastDirection = 0;

    const controller = new HandGestureController(controllerDependenciesMock);

    await controller.init();

    expect(serviceStub.initializeDetector).toHaveBeenCalled();
    expect(viewStub.loop).toHaveBeenCalled();
    expect(viewStub.scrollPage).toHaveBeenCalledWith(expectedLastDirection);
  });

  test("should handle the error if something bad happens inside estimateHands", async () => {
    const expectedMessage = "deu ruim**";
    const expectedError = new Error("error");

    serviceStub.estimateHands.mockRejectedValue(expectedError);

    const controller = new HandGestureController(controllerDependenciesMock);

    await controller.init();

    expect(console.error).toHaveBeenCalledWith(expectedMessage, expectedError);
  });
});
