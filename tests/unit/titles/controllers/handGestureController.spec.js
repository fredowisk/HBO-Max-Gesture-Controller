import { describe, test, jest, expect, beforeEach } from "@jest/globals";
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

const viewMock = {
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

const serviceMock = {
  estimateHands: jest.fn().mockResolvedValue([1]),
  detectGestures: detectGesturesMock,
  initializeDetector: jest.fn(),
};

const cameraMock = {
  video: {
    videoWidth: 1080,
  },
};

const controllerDependenciesMock = {
  view: viewMock,
  service: serviceMock,
  camera: cameraMock,
};

describe("Hand Gesture Controller test suite", () => {
  let controller;

  beforeEach(() => {
    controller = new HandGestureController(controllerDependenciesMock);
  })

  test("should call init when call initialize", async () => {
    const initSpy = jest
      .spyOn(HandGestureController.prototype, "init")
      .mockReturnValueOnce();

    await HandGestureController.initialize(controllerDependenciesMock);

    expect(initSpy).toHaveBeenCalled();
  });

  test("should call scaleContext when call init with a low quality video", async () => {
    cameraMock.video.videoWidth = 720;

    await controller.init();

    expect(viewMock.getCurrentPagePosition).toHaveBeenCalled();
    expect(viewMock.scaleContext).toHaveBeenCalled();
    expect(serviceMock.initializeDetector).toHaveBeenCalled();
    expect(viewMock.loop).toHaveBeenCalled();
    expect(viewMock.clickOnElement).toHaveBeenCalled();
  });

  test("should call scrollDown when call scrollHandler with scroll-down event", async () => {
    cameraMock.video.videoWidth = 1080;
    gestureMock.handedness = "Right";
    gestureMock.event = "scroll-down";

    const expectedLastDirection = 400;

    await controller.init();

    expect(serviceMock.initializeDetector).toHaveBeenCalled();
    expect(viewMock.loop).toHaveBeenCalled();
    expect(viewMock.scrollPage).toHaveBeenCalledWith(expectedLastDirection);
  });

  test("should call scrollUp when call scrollHandler with scroll-up event", async () => {
    gestureMock.handedness = "Right";
    gestureMock.event = "scroll-up";

    const expectedLastDirection = 0;

    await controller.init();

    expect(serviceMock.initializeDetector).toHaveBeenCalled();
    expect(viewMock.loop).toHaveBeenCalled();
    expect(viewMock.scrollPage).toHaveBeenCalledWith(expectedLastDirection);
  });

  test("should handle the error if something bad happens inside estimateHands", async () => {
    const expectedMessage = "deu ruim**";
    const expectedError = new Error("error");

    serviceMock.estimateHands.mockRejectedValue(expectedError);

    await controller.init();

    expect(console.error).toHaveBeenCalledWith(expectedMessage, expectedError);
  });
});
