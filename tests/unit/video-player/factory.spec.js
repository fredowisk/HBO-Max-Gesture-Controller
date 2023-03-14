import { describe, test, expect, jest } from "@jest/globals";
import Camera from "../../../lib/shared/camera.js";
import factory from "../../../pages/video-player/src/factory.js";
import Service from "../../../pages/video-player/src/service.js";
import Controller from "../../../pages/video-player/src/controller.js";
import * as supports from "../../../lib/shared/util.js";

jest.mock("../../../pages/video-player/src/util.js", () => {});

jest.mock(
  "../../../pages/video-player/src/service.js",
  () =>
    class Service {
      handBlinked() {}
      loadModel() {}
    }
);

jest.mock(
  "../../../pages/video-player/src/view.js",
  () =>
    class View {
      setVideoSrc() {}
    }
);

jest.mock(
  "../../../lib/shared/camera.js",
  () =>
    class Camera {
      static async init() {}
    }
);

jest.mock(
  "../../../pages/video-player/src/controller.js",
  () =>
    class Controller {
      static async initialize() {}
    }
);

console = { warn: () => {}, log: () => {} };

let workerTypeSpy = "commonjs";
global.Worker = class {
  constructor(path, { type }) {
    workerTypeSpy = type;
  }
};

window.location = {
  href: "./pages/",
};

describe("Video Player Factory test suite", () => {
  test("should initialize the Controller when call factory.initialize", async () => {
    supports.supportsWorkerType = () => false;

    const initSpy = jest.spyOn(Camera, "init");
    const initializeSpy = jest.spyOn(Controller, "initialize");
    const loadModelSpy = jest.spyOn(Service.prototype, "loadModel");

    await factory.initialize();
    expect(initSpy).toHaveBeenCalled();
    expect(initializeSpy).toHaveBeenCalled();
    expect(loadModelSpy).toHaveBeenCalled();
  });

  test("should create esm worker when browser supports esm", async () => {
    supports.supportsWorkerType = () => true;
    const expectedWorkerType = "module";

    await factory.initialize();

    expect(workerTypeSpy).toStrictEqual(expectedWorkerType);
  });
});
