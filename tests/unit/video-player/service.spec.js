import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import Service from "../../../pages/video-player/src/service.js";

jest.mock("../../../lib/shared/util.js", () => ({
  prepareRunChecker: () => ({
    shouldRun: () => true,
  }),
}));

describe.only("Video Player Service test suite", () => {
  let service = {};

  const estimateFacesMock = jest.fn().mockResolvedValue([]);

  const dependenciesMock = {
    faceLandmarksDetection: {
      load: jest.fn().mockResolvedValue({ estimateFaces: estimateFacesMock }),
      SupportedPackages: {
        mediapipeFacemesh: {},
      },
    },
  };

  const videoFake = {};

  beforeEach(async () => {
    service = new Service(dependenciesMock);
    await service.loadModel();
  });

  test("should call faceLandmarksDetection.load when call loadModel", () => {
    expect(dependenciesMock.faceLandmarksDetection.load).toHaveBeenCalled();
  });

  test("should return false when call handBlinked with incorrect video", async () => {
    const blinked = await service.handBlinked(videoFake);

    expect(blinked).toBeFalsy();
    expect(estimateFacesMock).toHaveBeenCalled();
  });

  test("should return false when call handBlinked with no eye blinking in video", async () => {
    const predictionsMock = [
      {
        annotations: {
          rightEyeUpper0: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
          rightEyeLower0: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
          leftEyeUpper0: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
          leftEyeLower0: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
        },
      },
    ];

    estimateFacesMock.mockResolvedValue(predictionsMock);

    const blinked = await service.handBlinked(videoFake);

    expect(blinked).toBeFalsy();
  });

  test("should return left when call handBlinked with left eye blinking in video", async () => {
    const videoFake = {};
    const predictionsMock = [
      {
        annotations: {
          rightEyeUpper0: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
          rightEyeLower0: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
          leftEyeUpper0: [
            [284.05548095703125, 173.50486755371094, 5.021456718444824],
            [285.9893493652344, 171.96864318847656, 2.9963436126708984],
            [289.3203430175781, 169.8876495361328, 0.8987394571304321],
            [294.9073181152344, 168.09207153320312, -0.6906358003616333],
            [300.9657897949219, 167.62132263183594, -1.0368752479553223],
            [307.27276611328125, 168.8210906982422, 0.1252802014350891],
            [312.0870056152344, 171.30886840820312, 1.3355998992919922],
          ],
          leftEyeLower0: [
            [282.62548828125, 174.5067901611328, 7.6465983390808105],
            [285.6192626953125, 175.90042114257812, 6.047150611877441],
            [288.6884460449219, 176.5914306640625, 4.573081970214844],
            [292.8079528808594, 176.86483764648438, 2.8221871852874756],
            [298.65087890625, 176.3794403076172, 1.3817510604858398],
            [304.21307373046875, 175.1947021484375, 0.9012088775634766],
            [309.5775451660156, 173.8778076171875, 1.4249553680419922],
            [312.9961853027344, 173.4678955078125, 2.340397357940674],
            [314.5293273925781, 173.25035095214844, 2.359804153442383],
          ],
        },
      },
    ];
    const expectedEyeBlinked = "left";

    estimateFacesMock.mockResolvedValue(predictionsMock);

    const blinked = await service.handBlinked(videoFake);

    expect(blinked).toStrictEqual(expectedEyeBlinked);
  });

  test("should return right when call handBlinked with right eye blinking in video", async () => {
    const videoFake = {};
    const predictionsMock = [
      {
        annotations: {
          rightEyeUpper0: [
            [390.3561553955078, 171.58534240722656, -0.398556113243103],
            [387.76853942871094, 170.87551879882812, -1.9047012329101562],
            [383.7188262939453, 170.10830688476562, -3.285407543182373],
            [377.8049621582031, 169.6825408935547, -3.808908462524414],
            [372.1100769042969, 169.54635620117188, -3.1785924434661865],
            [366.4622497558594, 169.90924072265625, -1.2425966262817383],
            [362.4468078613281, 171.00003051757812, 0.45267802476882935],
          ],
          rightEyeLower0: [
            [392.3870849609375, 171.87527465820312, 1.6523334980010986],
            [388.7467803955078, 173.3192901611328, 0.634973406791687],
            [384.89292907714844, 174.02151489257812, -0.3071153461933136],
            [380.1251525878906, 174.2390899658203, -1.2379729747772217],
            [374.21112060546875, 173.7560272216797, -1.6696853637695312],
            [369.2560729980469, 172.87847900390625, -1.1206746101379395],
            [364.63623046875, 171.9304656982422, 0.15717828273773193],
            [361.7109375, 171.90008544921875, 1.4749510288238525],
            [360.4703674316406, 172.06753540039062, 1.827606439590454],
          ],
          leftEyeUpper0: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
          leftEyeLower0: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
        },
      },
    ];

    const expectedEyeBlinked = "right";

    estimateFacesMock.mockResolvedValue(predictionsMock);

    const blinked = await service.handBlinked(videoFake);

    expect(blinked).toStrictEqual(expectedEyeBlinked);
  });
});
