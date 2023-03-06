import { prepareRunChecker } from "../../../../lib/shared/util.js";

const { shouldRun: shouldScroll } = prepareRunChecker({ timerDelay: 400 });
const { shouldRun: shouldClick } = prepareRunChecker({ timerDelay: 1500 });

const MIN_WIDTH = 1080;

export default class HandGestureController {
  #view;
  #service;
  #camera;
  #lastDirection;

  constructor({ view, service, camera }) {
    this.#view = view;
    this.#service = service;
    this.#camera = camera;
    this.#lastDirection = {
      y: 0,
    };
  }

  async init() {
    if (this.#camera.video.videoWidth < MIN_WIDTH) {
      this.#view.scaleContext();
    }
    return this.#loop();
  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps);
    return controller.init();
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video);

      this.#view.clearCanvas();

      if (!hands.length) return;

      this.#view.drawResults(hands);

      await this.#gestureHandler(hands);
    } catch (error) {
      console.error("deu ruim**", error);
    }
  }

  async #gestureHandler(hands) {
    const eventHandler = {
      Left: this.#leftEventHandler,
      Right: this.#rightEventHandler,
    };
    for await (const {
      handedness,
      event,
      x,
      y,
    } of this.#service.detectGestures(hands)) {
      console.log(handedness);
      eventHandler[handedness].call(this, event, x, y);
    }
  }

  #rightEventHandler(event) {
    if (event.includes("scroll")) return this.#scrollHandler(event);
  }

  #leftEventHandler(event, x, y) {
    if (event === "click") return this.#clickHandler(x, y);
  }

  #clickHandler(x, y) {
    if (!shouldClick()) return;

    this.#view.clickOnElement(x, y);
  }

  #scrollHandler(direction) {
    if (!shouldScroll()) return;

    const pixelsPerScroll = 200;

    const scroller = {
      "scroll-down": this.#scrollDown,
      "scroll-up": this.#scrollUp,
    };

    scroller[direction].call(this, pixelsPerScroll);

    this.#view.scrollPage(this.#lastDirection.y);
  }

  #scrollDown(pixelsPerScroll) {
    if (this.#lastDirection.y >= this.#view.totalHeight - pixelsPerScroll)
      return;
    this.#lastDirection.y += pixelsPerScroll;
  }

  #scrollUp(pixelsPerScroll) {
    if (this.#lastDirection.y <= 0) return;
    this.#lastDirection.y -= pixelsPerScroll;
  }

  async #loop() {
    await this.#service.initializeDetector();
    await this.#estimateHands();
    await this.#view.loop(this.#loop.bind(this));
  }
}
