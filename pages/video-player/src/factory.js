import Camera from "../../../lib/shared/camera.js";
import Controller from "./controller.js";
import Service from "./service.js";
import View from "./view.js";
import { supportsWorkerType } from "../../../lib/shared/util.js";

let worker, camera;

async function getWorker() {
  if (supportsWorkerType()) {
    console.log("initializing esm workers");
    const worker = new Worker("./src/worker.js", { type: "module" });
    return worker;
  }

  console.warn(`Your browser doesn't support esm modules on webworkers!`);
  console.warn(`Importing libraries...`);

  await import("./util.js");

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

  return workerMock;
}
const view = new View();

const [rootPath] = window.location.href.split("/pages/");
view.setVideoSrc(`${rootPath}/assets/video.mp4`);

const factory = {
  async initialize() {
    worker = await getWorker();
    camera = await Camera.init();
    await Controller.initialize({
      view,
      worker,
      camera,
    });

    if (!(worker instanceof Worker)) {
      worker.onmessage({ data: "READY" });
    }
  },
};

export default factory;
