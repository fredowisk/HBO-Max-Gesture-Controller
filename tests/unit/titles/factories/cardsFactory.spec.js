import { describe, test, jest, expect } from "@jest/globals";
import CardsController from "../../../../pages/titles/src/controllers/cardsController.js";

global.Worker = class {};
global.fetch = () => ({ json: () => {} });
window.location = {
  href: "./pages/",
};

const viewStub = class {};
const serviceStub = class {};

describe("Cards Factory test suite", () => {
  const serviceDependenciesMock = {
    view: viewStub,
    service: serviceStub,
  };

  test("should ", async () => {
    const initializeMock = jest
      .spyOn(CardsController, "initialize")
      .mockReturnValue();
    const { default: factory } = await import(
      "../../../../pages/titles/src/factories/cardsFactory"
    );
    await factory.initialize(serviceDependenciesMock);
    expect(initializeMock).toHaveBeenCalled();
  });
});
