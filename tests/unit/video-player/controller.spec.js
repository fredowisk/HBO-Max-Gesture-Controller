import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import Controller from "../../../pages/video-player/src/controller.js";

const viewMock = {
  configureOnBtnClick: () => {},
  configureOnVideoClick: () => {},
  isVideoPaused: jest.fn(),
  enableButton: () => {},
  playVideo: jest.fn(),
  pauseVideo: jest.fn(),
  getVideoFrame: jest.fn(),
  log: jest.fn(),
};

const workerMock = {};

const cameraMock = {
  video: {},
};

const dependenciesMock = {
  view: viewMock,
  worker: workerMock,
  camera: cameraMock,
};

console.log = () => {};

setTimeout = () => {};

describe("Video Player Controller test suite", () => {
  let controller;

  beforeEach(() => {
    controller = new Controller(dependenciesMock);
  });

  test("should call init when call initialize", async () => {
    const initSpy = jest.spyOn(Controller.prototype, "init");

    await Controller.initialize(dependenciesMock);
    expect(initSpy).toHaveBeenCalled();
  });

  test("should call loop when call onBtnStart", () => {
    const mockText = "Initializing detection!";

    const logSpy = jest.spyOn(Controller.prototype, "log").mockReturnValueOnce();
    const loopSpy = jest.spyOn(Controller.prototype, "loop").mockReturnValueOnce();

    controller.onBtnStart();
    expect(logSpy).toHaveBeenCalledWith(mockText);
    expect(loopSpy).toHaveBeenCalled();
  });

  test("should call log when call loop", () => {
    const mockText = "Detecting eye blink...";

    const logSpy = jest.spyOn(Controller.prototype, "log").mockReturnValueOnce();

    controller.loop();

    expect(viewMock.getVideoFrame).toHaveBeenCalledWith(cameraMock.video);
    expect(logSpy).toHaveBeenCalledWith(mockText);
  });

  test("should call view.log when call log", () => {
    const text = "Detecting eye blink...";
    const expectedText = `status: ${text}`;

    controller.log(text);

    expect(viewMock.log).toHaveBeenCalledWith(expectedText);
  });
  
  test('should call playVideo when call onVideoClick and video is paused', () => {
    
    viewMock.isVideoPaused.mockReturnValueOnce(true);

    controller.onVideoClick();

    expect(viewMock.isVideoPaused).toHaveBeenCalled();
    expect(viewMock.playVideo).toHaveBeenCalled();
    expect(viewMock.pauseVideo).not.toHaveBeenCalled();
  });

  test('should call pauseVideo when call onVideoClick and video is playing', () => {
    
    viewMock.isVideoPaused.mockReturnValueOnce(false);

    controller.onVideoClick();

    expect(viewMock.isVideoPaused).toHaveBeenCalled();
    expect(viewMock.pauseVideo).toHaveBeenCalled();
    expect(viewMock.playVideo).not.toHaveBeenCalled();
  });
});
