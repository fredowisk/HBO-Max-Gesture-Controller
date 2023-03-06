await (await import("./util.js")).default();

import Service from "./service.js";

const { tf, faceLandmarksDetection } = self;
tf.setBackend("cpu");

const service = new Service({
  faceLandmarksDetection,
});

console.log("loading tf model");
await service.loadModel();
console.log("tf model loaded");

setTimeout(() => postMessage("READY"), 2000);

onmessage = async ({ data: video }) => {
  console.log('velocidade')
  const blinked = await service.handBlinked(video);
  if (!blinked) return;
  postMessage({ blinked });
};
