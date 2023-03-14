import { describe, test, jest, expect, beforeEach } from "@jest/globals";
import CardsController from "../../../../pages/titles/src/controllers/cardsController.js";

const viewMock = {
  updateSearchTitleBarTotal: jest.fn(),
  addCards: jest.fn(),
  configureOnSearchInput: jest.fn(),
  clearCards: jest.fn(),
};

const serviceMock = {
  loadCards: jest.fn().mockResolvedValue(),
  filterTitles: jest.fn(),
};

const cardsControllerDependenciesMock = {
  view: viewMock,
  service: serviceMock,
};

describe("Cards Controller test suite", () => {
  let controller;

  beforeEach(() => {
    controller = new CardsController(cardsControllerDependenciesMock);
  })

  test("should call init when call initialize", async () => {
    const initSpy = jest
      .spyOn(CardsController.prototype, "init")
      .mockResolvedValueOnce();

    await CardsController.initialize(cardsControllerDependenciesMock);

    expect(initSpy).toHaveBeenCalled();
  });

  test("should call addCards when call init", async () => {
    const addCardsSpy = jest
      .spyOn(CardsController.prototype, "addCards")
      .mockReturnValueOnce();

    await controller.init();

    expect(addCardsSpy).toHaveBeenCalled();
  });

  test("should insert cards in view when call addCards", () => {
    const keywordMock = "Chocolate";

    serviceMock.filterTitles.mockReturnValueOnce([{ title: keywordMock }]);

    const expectedCards = [{ title: keywordMock }];
    const expectedItemsPerLine = 5;

    controller.addCards(keywordMock);

    expect(serviceMock.filterTitles).toHaveBeenCalledWith(keywordMock);
    expect(viewMock.addCards).toHaveBeenCalledWith(
      expectedCards,
      expectedItemsPerLine
    );
  });

  test("should call view.updateSearchTitleBarTotal when call addCards with non-existent keyword", () => {
    const expectedTotalCards = 0;
    serviceMock.filterTitles.mockReturnValueOnce([]);

    controller.addCards();

    expect(viewMock.updateSearchTitleBarTotal).toHaveBeenCalledWith(
      expectedTotalCards
    );
    expect(viewMock.addCards).not.toHaveBeenCalled();
  });

  test("should call onSearchInput when call init", async () => {
    viewMock.configureOnSearchInput.mockImplementation((cb) => cb());

    const addCardsSpy = jest
      .spyOn(CardsController.prototype, "addCards")
      .mockReturnValue();

    await controller.init();

    expect(viewMock.configureOnSearchInput).toHaveBeenCalled();
    expect(viewMock.clearCards).toHaveBeenCalled();
    expect(addCardsSpy).toHaveBeenCalledTimes(2);
  });
});
