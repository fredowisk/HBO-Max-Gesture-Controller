const INDEX_FINGER_TIP = "index_finger_tip";

export default class HandGestureService {
  #gestureEstimator;
  #handPoseDetection;
  #handsVersion;
  #detector;

  constructor({ fingerPose, handPoseDetection, handsVersion, knownGestures }) {
    this.#gestureEstimator = new fingerPose.GestureEstimator(knownGestures);
    this.#handPoseDetection = handPoseDetection;
    this.#handsVersion = handsVersion;
    this.#detector = null;
  }

  async #estimate(keypoints3D) {
    const predictions = await this.#gestureEstimator.estimate(
      this.#getLandMarksFromKeypoints(keypoints3D),
      10
    );

    return predictions;
  }

  async *detectGestures(predictions) {
    for (const { keypoints3D, keypoints, handedness } of predictions) {
      if (!keypoints3D) continue;

      const { gestures } = await this.#estimate(keypoints3D);

      if (!gestures.length) continue;

      const { name: gestureName } = gestures.reduce((previous, next) =>
        previous.score > next.score ? previous : next
      );

      const { x, y } = keypoints.find(({ name }) => name === INDEX_FINGER_TIP);

      yield { handedness, event: gestureName, x, y };
    }
  }

  #getLandMarksFromKeypoints(keypoints3D) {
    return keypoints3D.map(({ x, y, z }) => [x, y, z]);
  }

  async estimateHands(video) {
    return this.#detector.estimateHands(video, {
      flipHorizontal: true,
    });
  }

  async initializeDetector() {
    if (this.#detector) return this.#detector;

    const model = this.#handPoseDetection.SupportedModels.MediaPipeHands;

    const detectorConfig = {
      runtime: "mediapipe",
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${
        this.#handsVersion
      }`,
      modelType: "lite",
      maxHands: 2,
    };

    this.#detector = await this.#handPoseDetection.createDetector(
      model,
      detectorConfig
    );

    return this.#detector;
  }
}
