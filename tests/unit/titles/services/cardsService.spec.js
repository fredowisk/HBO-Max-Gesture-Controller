import { describe, test, jest, expect, beforeEach } from "@jest/globals";
import CardsService from "../../../../pages/titles/src/services/cardsService";

const dbUrlMock = "localhost";

const databaseMock = [
  {
    show_id: "fakeId",
    title: "Chocolate",
    duration: "fakeDuration",
    description: "fakeDescription",
    imageUrl: "fakeImage",
  },
];

const cardListWorkerMock = {
  postMessage: jest.fn(),
};

const cardsServiceDependenciesMock = {
  dbUrl: dbUrlMock,
  cardListWorker: cardListWorkerMock,
};

const jsonMock = {
  json: jest.fn(),
};

const cardsMock = [
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

global.fetch = () => {};

const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(jsonMock);


describe("Cards Service test suite", () => {
  let cardsService;

  beforeEach(() => {
    cardsService = new CardsService(cardsServiceDependenciesMock);
  });

  test("should call fetch with dbURL when call loadCards", async () => {
    await cardsService.loadCards();

    expect(fetchSpy).toHaveBeenCalledWith(dbUrlMock);
    expect(jsonMock.json).toHaveBeenCalled();
  });

  test("should return a card when call filterTitles with correct keyword", async () => {
    const keywordMock = "Chocolate";
    const expectedCards = cardsMock;

    jsonMock.json.mockResolvedValue(databaseMock);

    // jest.spyOn(global, "fetch").mockResolvedValue(jsonMock);

    await cardsService.loadCards();
    const cards = cardsService.filterTitles(keywordMock);

    expect(cardListWorkerMock.postMessage).toHaveBeenCalled();
    expect(cards).toHaveLength(1);
    expect(cards).toMatchObject(expectedCards);
  });

  test("should return all cards when call filterTitles without keyword", async () => {
    jsonMock.json.mockResolvedValue(databaseMock);

    const expectedCards = cardsMock;

    // jest.spyOn(global, "fetch").mockResolvedValue(jsonMock);

    await cardsService.loadCards();
    const cards = cardsService.filterTitles();

    expect(cardListWorkerMock.postMessage).not.toHaveBeenCalled();
    expect(cards).toHaveLength(1);
    expect(cards).toMatchObject(expectedCards);
  });
});
