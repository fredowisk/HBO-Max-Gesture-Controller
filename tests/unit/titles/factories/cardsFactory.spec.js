import { describe, test, jest, expect } from "@jest/globals";
import CardsController from "../../../../pages/titles/src/controllers/cardsController.js";
jest.mock(
  "../../../../pages/titles/src/controllers/cardsController.js",
  () =>
    class {
      static async initialize() {}
    }
);

const serviceDependenciesMock = {
  view: class {},
  service: class {},
};

global.Worker = class {};
global.fetch = () => ({ json: () => {} });

window.location = {
  href: "./pages/",
};

describe("Cards Factory test suite", () => {
  test("should ", async () => {
    const { default: factory } = await import(
      "../../../../pages/titles/src/factories/cardsFactory.js"
    );
    const initializeMock = jest.spyOn(CardsController, "initialize");

    await factory.initialize(serviceDependenciesMock);
    expect(initializeMock).toHaveBeenCalled();
  });
});
