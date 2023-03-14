import { describe, test, jest, expect, beforeEach } from "@jest/globals";
import CardsView from "../../../../pages/titles/src/views/cardsView.js";

const removeMock = {
  remove: jest.fn()
};

const browseSearchMock = {
  children: [removeMock, removeMock],
};

const eventMock =  {
  target: { disabled: true, value: "" },
};

const inputSearchMock = {
  value: "",
  addEventListener: jest
    .fn()
    .mockImplementation((eventName, cb) => cb(eventMock)),
  focus: jest.fn(),
};

const searchTitleBarMock = {
  innerText: "",
};

window.AddCardsOnBrowseSearchGrid = jest.fn();

jest.spyOn(global, "document", "get").mockReturnValue({
  getElementById: (selector) => {
    if (selector === "browseSearch") return browseSearchMock;
    if (selector === "inputSearch") return inputSearchMock;
    if (selector === "searchTitleBar") return searchTitleBarMock;
  },
});

describe("Cards View test suite", () => {
  let view;

  beforeEach(() => {
    view = new CardsView()
  });

  test("should call children.remove when call clearCards", () => {
    view.clearCards();

    expect(removeMock.remove).toHaveBeenCalledTimes(2);
  });

  test("should update inputSearch properties when call configureOnSearchInput", () => {
    const expectedCallback = jest.fn();

    view.configureOnSearchInput(expectedCallback);

    expect(inputSearchMock.value).toStrictEqual("");
    expect(inputSearchMock.addEventListener).toHaveBeenCalled();
    expect(expectedCallback).toHaveBeenCalled();
    expect(eventMock.target.disabled).toBeFalsy();
    expect(inputSearchMock.focus).toHaveBeenCalled();
  });

  test("should update searchTitleBar innerText when call updateSearchTitleBarTotal", () => {
    const totalMock =  1;
    const expectedText = `BROWSE SEARCH (${totalMock})`;

    view.updateSearchTitleBarTotal(totalMock);

    expect(searchTitleBarMock.innerText).toStrictEqual(expectedText);
  });

  test("should call updateSearchTitleBarTotal when call addCards", () => {
    const cardsMock =  [];
    const itemsPerLineMock =  5;

    const AddCardsOnBrowseSearchGridDependenciesMock = {
      cards: cardsMock,
      itemsPerLine: itemsPerLineMock,
    };

    const updateSearchTitleBarTotalSpy = jest
      .spyOn(CardsView.prototype, "updateSearchTitleBarTotal")
      .mockReturnValue();

    view.addCards(cardsMock, itemsPerLineMock);

    expect(window.AddCardsOnBrowseSearchGrid).toHaveBeenCalledWith(
      AddCardsOnBrowseSearchGridDependenciesMock
    );

    expect(updateSearchTitleBarTotalSpy).toHaveBeenCalledWith(cardsMock.length);
  });
});
