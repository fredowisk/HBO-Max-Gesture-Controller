import { describe, test, expect, jest } from "@jest/globals";

import HandGestureView from "../../../../pages/titles/src/views/handGestureView.js";

const fingerLookupIndexesMock = {
  indexFinger: [0],
};

const stylerStub = {
  loadDocumentStyles: jest.fn(),
  toggleStyle: jest.fn().mockReturnValue(jest.fn()),
};

setTimeout = (cb) => cb();

const getContextStub = {
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

const elementFromPointStub = {
  getBoundingClientRect: jest.fn().mockReturnValue({ left: 1, top: 1 }),
  dispatchEvent: jest.fn(),
};

global.Path2D = class {
  moveTo() {}
  lineTo() {}
};

global.requestAnimationFrame = () => {};

global.scroll = () => {};

global.MouseEvent = class {};

jest.spyOn(global, "document", "get").mockReturnValue({
  querySelector: () => ({ getContext: () => getContextStub }),
  body: {
    scrollHeight: 200,
  },
  elementFromPoint: () => elementFromPointStub,

  documentElement: {
    scrollTop: 200,
  },
});

describe("Hand Gesture View test suite", () => {
  const viewDependenciesMock = {
    fingerLookupIndexes: fingerLookupIndexesMock,
    styler: stylerStub,
  };

  test("should call canvasContext.clearRect when call clearCanvas", () => {
    const view = new HandGestureView(viewDependenciesMock);
    view.clearCanvas();

    expect(getContextStub.clearRect).toHaveBeenCalled();
  });

  test("should call canvasContext.scale when call scaleContect", () => {
    const expectedX = 2.2;
    const expectedY = 1.5;
    const view = new HandGestureView(viewDependenciesMock);
    view.scaleContext();

    expect(getContextStub.scale).toHaveBeenCalledWith(expectedX, expectedY);
  });

  test("should update canvasContext properties when call drawResults", () => {
    const expectedFillStyle = "red";
    const expectedStrokeStyle = "white";
    const expectedLineWidth = 8;
    const expectedLineJoin = "round";

    const handsMock = [
      {
        keypoints: [{ name: "index_finger_tip", x: 1, y: 1 }],
        handedness: "Left",
      },
    ];

    const view = new HandGestureView(viewDependenciesMock);
    view.drawResults(handsMock);

    expect(getContextStub.fillStyle).toStrictEqual(expectedFillStyle);
    expect(getContextStub.strokeStyle).toStrictEqual(expectedStrokeStyle);
    expect(getContextStub.lineWidth).toStrictEqual(expectedLineWidth);
    expect(getContextStub.lineJoin).toStrictEqual(expectedLineJoin);
  });

  test("should call drawJoints when call drawResults", () => {
    const handsMock = [
      {
        keypoints: [{ name: "index_finger_tip", x: 1, y: 1 }],
        handedness: "Left",
      },
    ];

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

    const view = new HandGestureView(viewDependenciesMock);
    view.drawResults(handsMock);

    expect(getContextStub.beginPath).toHaveBeenCalled();
    expect(getContextStub.arc).toHaveBeenCalledWith(
      ...Object.values(expectedArcParams)
    );
    expect(getContextStub.fill).toHaveBeenCalled();
  });

  test("should call drawFingersAndHoverElements when call drawResults", () => {
    const handsMock = [
      {
        keypoints: [{ name: "index_finger_tip", x: 1, y: 1 }],
        handedness: "Left",
      },
    ];

    const [
      {
        keypoints: [{ x, y }],
      },
    ] = handsMock;

    const moveToSpy = jest.spyOn(Path2D.prototype, "moveTo");
    const lineToSpy = jest.spyOn(Path2D.prototype, "lineTo");

    const view = new HandGestureView(viewDependenciesMock);
    view.drawResults(handsMock);

    expect(moveToSpy).toHaveBeenCalledWith(x, y);
    expect(lineToSpy).toHaveBeenCalledWith(x, y);
    expect(getContextStub.stroke).toHaveBeenCalled();
  });

  test("should call hoverElements when call drawResults", () => {
    const handsMock = [
      {
        keypoints: [{ name: "index_finger_tip", x: 1, y: 1 }],
        handedness: "Left",
      },
    ];

    const [
      {
        keypoints: [{ x, y }],
      },
    ] = handsMock;

    const expectedBehavior = ":hover";

    const elementFromPointSpy = jest
      .spyOn(document, "elementFromPoint")

    const view = new HandGestureView(viewDependenciesMock);
    view.drawResults(handsMock);

    expect(elementFromPointSpy).toHaveBeenCalledWith(x, y);

    expect(stylerStub.toggleStyle).toHaveBeenCalledWith(
      elementFromPointStub,
      expectedBehavior
    );
  });

  test("should dispatch a click event when call clickOnElement", () => {
    const x = 1;
    const y = 1;

    const elementFromPointSpy = jest.spyOn(document, "elementFromPoint");

    const view = new HandGestureView(viewDependenciesMock);
    view.clickOnElement(x, y);

    expect(elementFromPointSpy).toHaveBeenCalledWith(x, y);
    expect(elementFromPointStub.getBoundingClientRect).toHaveBeenCalled();
    expect(elementFromPointStub.dispatchEvent).toHaveBeenCalled();
  });

  test("should call requestAnimationFrame when call loop", () => {
    const expectedParam = jest.fn();

    const requestAnimationFrameSpy = jest.spyOn(
      global,
      "requestAnimationFrame"
    );

    const view = new HandGestureView(viewDependenciesMock);
    view.loop(expectedParam);

    expect(requestAnimationFrameSpy).toHaveBeenCalledWith(expectedParam);
  });

  test("should return the current scroll value when call getCurrentPagePosition", () => {
    const expectedScrollValue = 200;

    const view = new HandGestureView(viewDependenciesMock);
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

    const view = new HandGestureView(viewDependenciesMock);
    view.scrollPage(expectedTop);

    expect(scrollSpy).toHaveBeenCalledWith(expectedScrollParams);
  });
});
