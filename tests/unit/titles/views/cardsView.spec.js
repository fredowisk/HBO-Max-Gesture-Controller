import { describe, test, jest, expect } from "@jest/globals";
import CardsView from "../../../../pages/titles/src/views/cardsView.js";

const removeMock = jest.fn();

const browseSearchStub = {
  children: [{ remove: removeMock }, { remove: removeMock }],
};

const eventFake = {
  target: { disabled: true, value: "" },
};

const inputSearchStub = {
  value: "",
  addEventListener: jest
    .fn()
    .mockImplementation((eventName, cb) => cb(eventFake)),
  focus: jest.fn(),
};

const searchTitleBarStub = {
  innerText: "",
};

window.AddCardsOnBrowseSearchGrid = jest.fn();

jest.spyOn(global, "document", "get").mockReturnValue({
  getElementById: (selector) => {
    if (selector === "browseSearch") return browseSearchStub;
    if (selector === "inputSearch") return inputSearchStub;
    if (selector === "searchTitleBar") return searchTitleBarStub;
  },
});

describe("Cards View test suite", () => {
  test("should call children.remove when call clearCards", () => {
    const view = new CardsView();

    view.clearCards();

    expect(removeMock).toHaveBeenCalledTimes(2);
  });

  test("should update inputSearch properties when call configureOnSearchInput", () => {
    const expectedCallback = jest.fn();
    const view = new CardsView();

    view.configureOnSearchInput(expectedCallback);

    expect(inputSearchStub.value).toStrictEqual("");
    expect(inputSearchStub.addEventListener).toHaveBeenCalled();
    expect(expectedCallback).toHaveBeenCalled();
    expect(eventFake.target.disabled).toBeFalsy();
    expect(inputSearchStub.focus).toHaveBeenCalled();
  });

  test("should update searchTitleBar innerText when call updateSearchTitleBarTotal", () => {
    const totalFake = 1;
    const expectedText = `BROWSE SEARCH (${totalFake})`;
    const view = new CardsView();
    view.updateSearchTitleBarTotal(totalFake);

    expect(searchTitleBarStub.innerText).toStrictEqual(expectedText);
  });

  test("should call updateSearchTitleBarTotal when call addCards", () => {
    const cardsFake = [];
    const itemsPerLineFake = 5;

    const AddCardsOnBrowseSearchGridDependenciesMock = {
      cards: cardsFake,
      itemsPerLine: itemsPerLineFake,
    };

    const updateSearchTitleBarTotalSpy = jest
      .spyOn(CardsView.prototype, "updateSearchTitleBarTotal")
      .mockReturnValue();

    const view = new CardsView();
    view.addCards(cardsFake, itemsPerLineFake);

    expect(window.AddCardsOnBrowseSearchGrid).toHaveBeenCalledWith(
      AddCardsOnBrowseSearchGridDependenciesMock
    );

    expect(updateSearchTitleBarTotalSpy).toHaveBeenCalledWith(cardsFake.length);
  });
});
