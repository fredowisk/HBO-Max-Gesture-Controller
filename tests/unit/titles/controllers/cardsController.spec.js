import { describe, test, jest, expect } from "@jest/globals";
import CardsController from "../../../../pages/titles/src/controllers/cardsController.js";

const viewStub = {
  updateSearchTitleBarTotal: jest.fn(),
  addCards: jest.fn(),
  configureOnSearchInput: jest.fn(),
  clearCards: jest.fn(),
};

const serviceStub = {
  loadCards: jest.fn().mockResolvedValue(),
  filterTitles: jest.fn(),
};

describe("Cards Controller test suite", () => {
  const cardsControllerDependenciesMock = {
    view: viewStub,
    service: serviceStub,
  };

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

    const controller = new CardsController(cardsControllerDependenciesMock);

    await controller.init();

    expect(addCardsSpy).toHaveBeenCalled();
  });

  test("should insert cards in view when call addCards", () => {
    const keywordMock = "Chocolate";

    serviceStub.filterTitles.mockReturnValueOnce([{ title: keywordMock }]);

    const expectedCards = [{ title: keywordMock }];
    const expectedItemsPerLine = 5;

    const controller = new CardsController(cardsControllerDependenciesMock);

    controller.addCards(keywordMock);

    expect(serviceStub.filterTitles).toHaveBeenCalledWith(keywordMock);
    expect(viewStub.addCards).toHaveBeenCalledWith(
      expectedCards,
      expectedItemsPerLine
    );
  });

  test("should call view.updateSearchTitleBarTotal when call addCards with non-existent keyword", () => {
    const expectedTotalCards = 0;
    serviceStub.filterTitles.mockReturnValueOnce([]);

    const controller = new CardsController(cardsControllerDependenciesMock);

    controller.addCards();

    expect(viewStub.updateSearchTitleBarTotal).toHaveBeenCalledWith(
      expectedTotalCards
    );
    expect(viewStub.addCards).not.toHaveBeenCalled();
  });

  test("should call onSearchInput when call init", async () => {
    viewStub.configureOnSearchInput.mockImplementation((cb) => cb());

    const addCardsSpy = jest
      .spyOn(CardsController.prototype, "addCards")
      .mockReturnValue();

    const controller = new CardsController(cardsControllerDependenciesMock);

    await controller.init();

    expect(viewStub.configureOnSearchInput).toHaveBeenCalled();
    expect(viewStub.clearCards).toHaveBeenCalled();
    expect(addCardsSpy).toHaveBeenCalledTimes(2);
  });
});
