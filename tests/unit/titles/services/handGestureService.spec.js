import { describe, test, jest, expect, beforeEach } from "@jest/globals";

import HandGestureService from "../../../../pages/titles/src/services/handGestureService.js";

const fingerPoseMock = {
  GestureEstimator: class {
    async estimate() {
      return Promise.resolve({
        gestures: [
          { name: "click", score: 1 },
          { name: "scroll", score: 0 },
          { name: "click", score: 2 },
        ],
      });
    }
  },
};

const estimateHandsMock = {
  estimateHands: jest.fn().mockResolvedValue([1]),
};

const handPoseDetectionMock = {
  SupportedModels: {
    MediaPipeHands: {},
  },
  createDetector: jest.fn().mockResolvedValue(estimateHandsMock),
};

const handsVersionMock = 2.4;
const knownGesturesMock = {};

const serviceDependenciesMock = {
  fingerPose: fingerPoseMock,
  handPoseDetection: handPoseDetectionMock,
  handsVersion: handsVersionMock,
  knownGestures: knownGesturesMock,
};

describe("Hand Gesture Service test suite", () => {
  let service;

  beforeEach(() => {
    service = new HandGestureService(serviceDependenciesMock)
  })

  test("should return a handPoseDetector when call initializeDetector", async () => {
    const expectedDetector = estimateHandsMock;

    const detector = await service.initializeDetector();

    expect(handPoseDetectionMock.createDetector).toHaveBeenCalled();
    expect(detector).toStrictEqual(expectedDetector);
  });

  test("should return the detected hands when call estimateHands", async () => {
    const videoMock =  {};

    await service.initializeDetector();
    const hands = await service.estimateHands(videoMock);

    expect(estimateHandsMock.estimateHands).toHaveBeenCalled();
    expect(hands).toHaveLength(1);
  });

  test("should return gestures information when call async generator detectGestures", async () => {
    const predictionsMock = [
      {
        keypoints3D: [{ x: 1, y: 1, z: 1 }],
        keypoints: [{ name: "index_finger_tip", x: 1, y: 1 }],
        handedness: "Left",
      },
    ];

    const expectedGestureInformation = {
      handedness: "Left",
      event: "click",
      x: 1,
      y: 1,
    };

    const estimateSpy = jest.spyOn(
      fingerPoseMock.GestureEstimator.prototype,
      "estimate"
    );

    const gestureInformation = [];

    for await (const info of service.detectGestures(predictionsMock)) {
      gestureInformation.push(info);
    }

    expect(estimateSpy).toHaveBeenCalled();
    expect(gestureInformation[0]).toMatchObject(expectedGestureInformation);
  });
});
