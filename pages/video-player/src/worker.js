await (await import("./util.js")).default();

import Service from "./service.js";

const { tf, faceLandmarksDetection } = self;
tf.setBackend("webgl");

const service = new Service({
  faceLandmarksDetection,
});

console.log("loading tf model");
await service.loadModel();
console.log("tf model loaded");
postMessage("READY");

onmessage = async ({ data: video }) => {
  const blinked = await service.handBlinked(video);
  if (!blinked) return;
  postMessage({ blinked });
};
