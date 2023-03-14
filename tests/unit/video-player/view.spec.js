import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import View from "../../../pages/video-player/src/view.js";

class ImageDataMock {}

const buttonObjectMock = {
  disabled: true,
  addEventListener: jest.fn(),
  innerHTML: "Not yet detecting eye blink",
};

const videoObjectMock = {
  play: jest.fn(),
  pause: jest.fn(),
  paused: true,
  addEventListener: jest.fn(),
  src: "./",
};

const contextMethodsMock = {
  drawImage: jest.fn(),
  getImageData: jest.fn().mockReturnValue(new ImageDataMock(1, 1)),
};

const getContextMock = {
  getContext: () => contextMethodsMock,
};

jest.spyOn(global, "document", "get").mockReturnValue({
  querySelector: (selector) => {
    if (selector !== "#video") return buttonObjectMock;

    return videoObjectMock;
  },

  createElement: () => getContextMock,
});

describe("Video Player View test suite", () => {
  let view;

  beforeEach(() => {
    view = new View();
  });

  test("should return ImageData when call getVideoFrame", () => {
    const videoMock = { videoWidth: 1, videoHeight: 1 };
    const contextParamsMock = [
      0,
      0,
      videoMock.videoWidth,
      videoMock.videoHeight,
    ];

    const contextImageData = view.getVideoFrame(videoMock);

    expect(contextMethodsMock.drawImage).toHaveBeenCalledWith(
      videoMock,
      ...contextParamsMock
    );

    expect(contextMethodsMock.getImageData).toHaveBeenCalledWith(
      ...contextParamsMock
    );

    expect(contextImageData).toBeInstanceOf(ImageDataMock);
  });

  test("should call videoElement.play when call playVideo", () => {
    view.playVideo();

    expect(videoObjectMock.play).toHaveBeenCalled();
  });

  test("should call videoElement.pause when call pauseVideo", () => {
    view.pauseVideo();

    expect(videoObjectMock.pause).toHaveBeenCalled();
  });

  test("should return true when call isVideoPaused and video is paused", () => {
    const isPaused = view.isVideoPaused();

    expect(isPaused).toBeTruthy();
  });

  test("should enable init button when call enableButton", () => {
    expect(buttonObjectMock.disabled).toStrictEqual(true);

    view.enableButton();

    expect(buttonObjectMock.disabled).toStrictEqual(false);
  });

  test("should call addEventListener when call configureOnBtnClick", () => {
    const configurationMock = () => {};
    const eventType = "click";

    view.configureOnBtnClick(configurationMock);

    expect(buttonObjectMock.addEventListener).toHaveBeenCalledWith(
      eventType,
      configurationMock
    );
  });

  test("should call addEventListener when call configureOnVideoClick", () => {
    const configurationMock = () => {};
    const eventType = "click";

    view.configureOnVideoClick(configurationMock);

    expect(videoObjectMock.addEventListener).toHaveBeenCalledWith(
      eventType,
      configurationMock
    );
  });

  test("should update the statusElement innerHTML when call log", () => {
    const expectedStatus = "Detecting eye blink";

    view.log(expectedStatus);

    expect(buttonObjectMock.innerHTML).toStrictEqual(expectedStatus);
  });

  test("should update the video src when call setVideoSrc", () => {
    const expectedSrc = "../../../assets/video.mp4";

    view.setVideoSrc(expectedSrc);

    expect(videoObjectMock.src).toStrictEqual(expectedSrc);
  });
});
