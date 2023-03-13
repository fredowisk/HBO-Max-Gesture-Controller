import { describe, test, jest, expect } from "@jest/globals";
import CardsService from "../../../../pages/titles/src/services/cardsService";

const dbUrlFake = "localhost";

const databaseFake = [
  {
    show_id: "fakeId",
    title: "Chocolate",
    duration: "fakeDuration",
    description: "fakeDescription",
    imageUrl: "fakeImage",
  },
];

const cardListWorkerStub = {
  postMessage: jest.fn(),
};

global.fetch = () => {};

describe("Cards Service test suite", () => {
  const cardsServiceDependenciesMock = {
    dbUrl: dbUrlFake,
    cardListWorker: cardListWorkerStub,
  };

  test("should call fetch with dbURL when call loadCards", async () => {
    const jsonMock = {
      json: jest.fn(),
    };
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(jsonMock);

    const cardsService = new CardsService(cardsServiceDependenciesMock);

    await cardsService.loadCards();

    expect(fetchSpy).toHaveBeenCalledWith(dbUrlFake);
    expect(jsonMock.json).toHaveBeenCalled();
  });

  test("should return a card when call filterTitles with correct keyword", async () => {
    const keywordFake = "Chocolate";
    const expectedCards = [
      {
        background: "fakeImage",
        display_background:
          "//external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fhdqwalls.com%2Fdownload%2Finterstellar-gargantua-u4-1920x1080.jpg&f=1&nofb=1",
        title: "Chocolate",
        description: "fakeDescription",
        show_id: "fakeId",
        duration: "fakeDuration",
      },
    ];
    const jsonMock = {
      json: jest.fn().mockResolvedValue(databaseFake),
    };
    jest.spyOn(global, "fetch").mockResolvedValue(jsonMock);

    const cardsService = new CardsService(cardsServiceDependenciesMock);

    await cardsService.loadCards();
    const cards = cardsService.filterTitles(keywordFake);

    expect(cardListWorkerStub.postMessage).toHaveBeenCalled();
    expect(cards).toHaveLength(1);
    expect(cards).toMatchObject(expectedCards);
  });

  test("should return all cards when call filterTitles without keyword", async () => {
    const expectedCards = [
      {
        background: "fakeImage",
        display_background:
          "//external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fhdqwalls.com%2Fdownload%2Finterstellar-gargantua-u4-1920x1080.jpg&f=1&nofb=1",
        title: "Chocolate",
        description: "fakeDescription",
        show_id: "fakeId",
        duration: "fakeDuration",
      },
    ];
    const jsonMock = {
      json: jest.fn().mockResolvedValue(databaseFake),
    };
    jest.spyOn(global, "fetch").mockResolvedValue(jsonMock);

    const cardsService = new CardsService(cardsServiceDependenciesMock);

    await cardsService.loadCards();
    const cards = cardsService.filterTitles();

    expect(cardListWorkerStub.postMessage).not.toHaveBeenCalled();
    expect(cards).toHaveLength(1);
    expect(cards).toMatchObject(expectedCards);
  });
});
