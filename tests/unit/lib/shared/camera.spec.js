import { describe, test, expect, jest } from "@jest/globals";
import Camera from "../../../../lib/shared/camera.js";

const videoObjectMock = {
  srcObject: {},
  onloadedmetadata: {},
  play: jest.fn(),
};

const navigatorMock = {
  mediaDevices: {
    getUserMedia: jest.fn().mockReturnValue("streamFake"),
  },
};

jest.spyOn(global, "document", "get").mockReturnValue({
  createElement: () => videoObjectMock,
  addEventListener: () => {},
});

global.Promise = class {
  constructor(cb) {
    cb(() => {});
  }
}

jest.spyOn(global, "navigator", "get").mockReturnValue(navigatorMock);

describe("Camera test suite", () => {
  test("should start camera stream when call init", async () => {
    const expectedStream = "streamFake";

    const camera = await Camera.init();
    camera.video.onloadedmetadata();

    expect(navigatorMock.mediaDevices.getUserMedia).toHaveBeenCalled();
    expect(videoObjectMock.srcObject).toStrictEqual(expectedStream);
    expect(videoObjectMock.play).toHaveBeenCalled();
    expect(camera).toBeInstanceOf(Camera);
  });

  test("should throw an error if Browser doesn't have getUserMedia API", async () => {
    jest.spyOn(global, "navigator", "get").mockReturnValue({});

    const expectedErrorMessage =
      "Browser API navigator.mediaDevices.getUserMedia not available!";

    await expect(Camera.init()).rejects.toThrow(expectedErrorMessage);
  });
});
