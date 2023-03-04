import Camera from "../../../lib/shared/camera.js";
import { supportsWorkerType } from "../../../lib/shared/util.js";
import Controller from "./controller.js";
import Service from "./service.js";
import View from "./view.js";

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
    async onmessage(video) {
      const blinked = await service.handBlinked(video);
      if (!blinked) return;
      workerMock.onmessage({ data: { blinked } });
    },
    postMessage(msg) {},
  };

  console.log("loading tf model...");
  await service.loadModel();
  console.log("tf model loaded!");

  setTimeout(() => worker.postMessage({ data: "READY" }), 500);

  return workerMock;
}

const worker = await getWorker();

const camera = await Camera.init();
const factory = {
  async initialize() {
    return Controller.initialize({
      view: new View(),
      worker,
      camera,
    });
  },
};

export default factory;
