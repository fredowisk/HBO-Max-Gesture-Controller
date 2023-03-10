import { describe, test, expect, jest } from "@jest/globals";

import HandGestureView from "../../../../pages/titles/src/views/handGestureView.js";

const fingerLookupIndexesMock = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

const stylerStub = {
  loadDocumentStyles: jest.fn(),
  toggleStyle: jest.fn(),
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

jest.spyOn(global, "document", "get").mockReturnValue({
  querySelector: () => ({ getContext: () => getContextStub }),
  body: {
    scrollHeight: 200,
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
});
