import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import HandGestureView from "../../../../pages/titles/src/views/handGestureView.js";

const fingerLookupIndexesMock = {
  indexFinger: [0],
};

const stylerMock = {
  loadDocumentStyles: jest.fn(),
  toggleStyle: jest.fn().mockReturnValue(jest.fn()),
};

setTimeout = (cb) => cb();

const getContextMock = {
  clearRect: jest.fn(),
  scale: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 0,
  lineJoin: "",
};

const elementFromPointMock = {
  getBoundingClientRect: jest.fn().mockReturnValue({ left: 1, top: 1 }),
  dispatchEvent: jest.fn(),
};

const viewDependenciesMock = {
  fingerLookupIndexes: fingerLookupIndexesMock,
  styler: stylerMock,
};

const handsMock = [
  {
    keypoints: [{ name: "index_finger_tip", x: 1, y: 1 }],
    handedness: "Left",
  },
];

global.Path2D = class {
  moveTo() {}
  lineTo() {}
};

global.requestAnimationFrame = () => {};

global.scroll = () => {};

global.MouseEvent = class {};

jest.spyOn(global, "document", "get").mockReturnValue({
  querySelector: () => ({ getContext: () => getContextMock }),
  body: {
    scrollHeight: 200,
  },
  elementFromPoint: () => elementFromPointMock,

  documentElement: {
    scrollTop: 200,
  },
});

describe("Hand Gesture View test suite", () => {
  let view;

  beforeEach(() => {
    view = new HandGestureView(viewDependenciesMock)
  });

  test("should call canvasContext.clearRect when call clearCanvas", () => {
    view.clearCanvas();

    expect(getContextMock.clearRect).toHaveBeenCalled();
  });

  test("should call canvasContext.scale when call scaleContext", () => {
    const expectedX = 2.2;
    const expectedY = 1.5;

    view.scaleContext();

    expect(getContextMock.scale).toHaveBeenCalledWith(expectedX, expectedY);
  });

  test("should update canvasContext properties when call drawResults", () => {
    const expectedFillStyle = "red";
    const expectedStrokeStyle = "white";
    const expectedLineWidth = 8;
    const expectedLineJoin = "round";

    view.drawResults(handsMock);

    expect(getContextMock.fillStyle).toStrictEqual(expectedFillStyle);
    expect(getContextMock.strokeStyle).toStrictEqual(expectedStrokeStyle);
    expect(getContextMock.lineWidth).toStrictEqual(expectedLineWidth);
    expect(getContextMock.lineJoin).toStrictEqual(expectedLineJoin);
  });

  test("should call drawJoints when call drawResults", () => {

    const [
      {
        keypoints: [{ x, y }],
      },
    ] = handsMock;

    const expectedArcParams = {
      newX: x - 2,
      newY: y - 2,
      radius: 3,
      startAngle: 0,
      endAngle: 2 * Math.PI,
    };

    view.drawResults(handsMock);

    expect(getContextMock.beginPath).toHaveBeenCalled();
    expect(getContextMock.arc).toHaveBeenCalledWith(
      ...Object.values(expectedArcParams)
    );
    expect(getContextMock.fill).toHaveBeenCalled();
  });

  test("should call drawFingersAndHoverElements when call drawResults", () => {

    const [
      {
        keypoints: [{ x, y }],
      },
    ] = handsMock;

    const moveToSpy = jest.spyOn(Path2D.prototype, "moveTo");
    const lineToSpy = jest.spyOn(Path2D.prototype, "lineTo");

    view.drawResults(handsMock);

    expect(moveToSpy).toHaveBeenCalledWith(x, y);
    expect(lineToSpy).toHaveBeenCalledWith(x, y);
    expect(getContextMock.stroke).toHaveBeenCalled();
  });

  test("should call hoverElements when call drawResults", () => {

    const [
      {
        keypoints: [{ x, y }],
      },
    ] = handsMock;

    const expectedBehavior = ":hover";

    const elementFromPointSpy = jest
      .spyOn(document, "elementFromPoint")

    view.drawResults(handsMock);

    expect(elementFromPointSpy).toHaveBeenCalledWith(x, y);

    expect(stylerMock.toggleStyle).toHaveBeenCalledWith(
      elementFromPointMock,
      expectedBehavior
    );
  });

  test("should dispatch a click event when call clickOnElement", () => {
    const [
      {
        keypoints: [{ x, y }],
      },
    ] = handsMock;

    const elementFromPointSpy = jest.spyOn(document, "elementFromPoint");

    view.clickOnElement(x, y);

    expect(elementFromPointSpy).toHaveBeenCalledWith(x, y);
    expect(elementFromPointMock.getBoundingClientRect).toHaveBeenCalled();
    expect(elementFromPointMock.dispatchEvent).toHaveBeenCalled();
  });

  test("should call requestAnimationFrame when call loop", () => {
    const expectedLoopParam = jest.fn();

    const requestAnimationFrameSpy = jest.spyOn(
      global,
      "requestAnimationFrame"
    );

    view.loop(expectedLoopParam);

    expect(requestAnimationFrameSpy).toHaveBeenCalledWith(expectedLoopParam);
  });

  test("should return the current scroll value when call getCurrentPagePosition", () => {
    const expectedScrollValue = 200;

    const position = view.getCurrentPagePosition();

    expect(position).toStrictEqual(expectedScrollValue);
  });

  test("should call scroll when call scrollPage", () => {
    const expectedTop = 200;
    const expectedScrollParams = {
      top: expectedTop,
      behavior: "smooth",
    };
    const scrollSpy = jest.spyOn(global, "scroll");

    view.scrollPage(expectedTop);

    expect(scrollSpy).toHaveBeenCalledWith(expectedScrollParams);
  });
});
