import Camera from "../../../lib/shared/camera.js";
import Controller from "./controller.js";
import Service from "./service.js";
import View from "./view.js";
import { supportsWorkerType } from "../../../lib/shared/util.js";

async function getWorker() {
  if (supportsWorkerType()) {
    console.log("initializing esm workers");
    const worker = new Worker("./src/worker.js", { type: "module" });
    return worker;
  }
  console.warn(`Your browser doesn't support esm modules on webworkers!`);
  console.warn(`Importing libraries...`);

  await (await import("./util.js")).default();

  console.warn("using worker mock instead");
  const service = new Service({
    faceLandmarksDetection: window.faceLandmarksDetection,
  });

  const workerMock = {
    async postMessage(video) {
      const blinked = await service.handBlinked(video);
      if (!blinked) return;
      workerMock.onmessage({ data: { blinked } });
    },
    onmessage(msg) {},
  };
  console.log("loading tf model...");
  await service.loadModel();
  console.log("tf model loaded!");

  setTimeout(() => worker.onmessage({ data: "READY" }), 3000);

  return workerMock;
}

const view = new View();

const worker = await getWorker();

const camera = await Camera.init();

const factory = {
  async initialize() {
    return Controller.initialize({
      view,
      worker,
      camera,
    });
  },
};

export default factory;
