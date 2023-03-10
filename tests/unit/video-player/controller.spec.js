import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import Controller from "../../../pages/video-player/src/controller.js";

const viewStub = {
  configureOnBtnClick: () => {},
  enableButton: () => {},
  playVideo: () => {},
  pauseVideo: () => {},
  getVideoFrame: () => {},
  log: () => {},
};

const cameraStub = {
  video: {},
};

console.log = () => {};

setTimeout = () => {};

describe("Video Player Controller test suite", () => {
  let controller = {};

  const dependenciesMock = {
    view: viewStub,
    worker: {},
    camera: cameraStub,
  };

  beforeEach(() => {
    controller = new Controller(dependenciesMock);
  });

  test("should call init when call initialize", async () => {
    const initSpy = jest.spyOn(Controller.prototype, "init");

    await Controller.initialize(dependenciesMock);
    expect(initSpy).toHaveBeenCalled();
  });

  test("should call log when call onBtnStart", () => {
    const mockText = "Initializing detection!";

    const logSpy = jest.spyOn(Controller.prototype, "log");

    controller.onBtnStart();
    expect(logSpy).toHaveBeenCalledWith(mockText);
  });

  test("should call loop when call onBtnStart", () => {
    const loopSpy = jest.spyOn(Controller.prototype, "loop");

    controller.onBtnStart();
    expect(loopSpy).toHaveBeenCalled();
  });

  test("should call log when call loop", () => {
    const mockText = "Detecting eye blink...";

    const logSpy = jest.spyOn(Controller.prototype, "log");

    controller.loop();
    expect(logSpy).toHaveBeenCalledWith(mockText);
  });
});
