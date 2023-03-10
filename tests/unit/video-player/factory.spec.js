import { describe, test, expect, jest } from "@jest/globals";
import factory from "../../../pages/video-player/src/factory.js";
import Camera from "../../../lib/shared/camera.js";
import Controller from "../../../pages/video-player/src/controller.js";
import * as supports from "../../../lib/shared/util.js";

console = { warn: () => {}, log: () => {} };

const cameraSpy = jest.spyOn(Camera, "init").mockResolvedValue({});

const controllerSpy = jest.spyOn(Controller, "initialize").mockResolvedValue();

jest.mock("../../../pages/video-player/src/service.js", () => {
  return class Service {
    handBlinked() {}
    loadModel() {}
  };
});

jest.mock("../../../pages/video-player/src/view.js", () => {
  return class View {
    setVideoSrc() {}
  };
});

jest.mock("../../../pages/video-player/src/util.js", () => {
  return function () {};
});

let workerTypeSpy = "commonjs";
global.Worker = class {
  constructor(path, { type }) {
    workerTypeSpy = type;
  }
};

describe("Factory test suite", () => {
  test("should initialize the Controller when call factory.initialize", async () => {
    supports.supportsWorkerType = () => true;

    await factory.initialize();
    expect(cameraSpy).toHaveBeenCalled();
    expect(controllerSpy).toHaveBeenCalled();
  });

  test("should create esm worker when browser supports esm", async () => {
    supports.supportsWorkerType = () => false;
    const expectedWorkerType = "module";

    await factory.initialize();

    expect(workerTypeSpy).toStrictEqual(expectedWorkerType);
  });
});
