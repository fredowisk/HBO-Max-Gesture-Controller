import { fingerLookupIndexes, importer, knownGestures } from "../util/util.js";

(async () => {
  await importer();
})();

import HandGestureController from "../controllers/handGestureController.js";
import HandGestureService from "../services/handGestureService.js";
import HandGestureView from "../views/handGestureView.js";

import Camera from "../../../../lib/shared/camera.js";

const styler = new PseudoStyler();

const factory = {
  async initialize() {
    const camera = await Camera.init();
    return HandGestureController.initialize({
      view: new HandGestureView({
        fingerLookupIndexes,
        styler,
      }),
      service: new HandGestureService({
        fingerPose: window.fp,
        handPoseDetection: window.handPoseDetection,
        handsVersion: window.VERSION,
        knownGestures,
      }),
      camera,
    });
  },
};

export default factory;
