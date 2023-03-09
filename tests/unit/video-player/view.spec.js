import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import View from "../../../pages/video-player/src/view.js";

class ImageDataStub {}

const buttonObjectStub = {
  disabled: true,
  addEventListener: jest.fn(),
  innerHTML: "Not yet detecting eye blink",
};

const videoObjectStub = {
  play: jest.fn(),
  pause: jest.fn(),
  src: './'
}

jest.spyOn(global, "document", "get").mockReturnValue({
  querySelector: (selector) => {
    if (selector !== "#video") return buttonObjectStub;

    return videoObjectStub;
  },
  createElement: () => ({
    getContext: () => ({
      drawImage: () => {},
      getImageData: () => new ImageDataStub(1, 1),
    }),
  }),
});

describe("View test suite", () => {
  let view;

  beforeEach(() => {
    view = new View();
  });

  test("should return ImageData when call getVideoFrame", () => {
    const videoFake = { videoWidth: 1, videoHeight: 1 };

    const contextImageData = view.getVideoFrame(videoFake);

    expect(contextImageData).toBeInstanceOf(ImageDataStub);
  });

  test("should call videoElement.play when call playVideo", () => {
    view.playVideo();

    expect(videoObjectStub.play).toHaveBeenCalled();
  });

  test("should call videoElement.pause when call pauseVideo", () => {
    view.pauseVideo();

    expect(videoObjectStub.pause).toHaveBeenCalled();
  });

  test("should enable init button when call enableButton", () => {
    expect(buttonObjectStub.disabled).toStrictEqual(true);

    view.enableButton();

    expect(buttonObjectStub.disabled).toStrictEqual(false);
  });

  test("should call addEventListener when call configureOnBtnClick", () => {
    const configurationMock = () => {};
    const eventType = "click";

    view.configureOnBtnClick(configurationMock);

    expect(buttonObjectStub.addEventListener).toHaveBeenCalledWith(
      eventType,
      configurationMock
    );
  });

  test("should update the statusElement innerHTML when call log", () => {
    const expectedStatus = "Detecting eye blink";

    view.log(expectedStatus);

    expect(buttonObjectStub.innerHTML).toStrictEqual(expectedStatus);
  });

  test("should update the video src when call setVideoSrc", () => {
    const expectedSrc = "../../../assets/video.map4";

    view.setVideoSrc(expectedSrc);

    expect(videoObjectStub.src).toStrictEqual(expectedSrc);
  });
});
