export default class HandGestureView {
  #fingerLookupIndexes;
  #canvas;
  #canvasContext;
  #styler;
  #scalers;

  constructor({ fingerLookupIndexes, styler }) {
    this.#fingerLookupIndexes = fingerLookupIndexes;
    this.#canvas = document.querySelector("#hands");
    this.#canvasContext = this.#canvas.getContext("2d");
    this.#canvas.width = globalThis.screen.availWidth;
    this.#canvas.height = globalThis.screen.availHeight;
    this.#styler = styler;
    this.#scalers = {
      x: 1,
      y: 1,
    };

    this.totalHeight = document.body.scrollHeight;

    setTimeout(() => this.#styler.loadDocumentStyles(), 200);
  }

  clearCanvas() {
    this.#canvasContext.clearRect(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );
  }

  scaleContext() {
    this.#scalers.x = 2.2;
    this.#scalers.y = 1.5;

    const { x, y } = this.#scalers;

    this.#canvasContext.scale(x, y);
  }

  drawResults(hands) {
    for (const { keypoints, handedness } of hands) {
      if (!keypoints) continue;

      this.#canvasContext.fillStyle = handedness === "Left" ? "red" : "green";
      this.#canvasContext.strokeStyle = "white";
      this.#canvasContext.lineWidth = 8;
      this.#canvasContext.lineJoin = "round";

      this.#drawJoients(keypoints);
      this.#drawFingersAndHoverElements(keypoints);
    }
  }

  clickOnElement(x, y) {
    const element = document.elementFromPoint(
      x * this.#scalers.x,
      y * this.#scalers.y
    );
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.left + x,
      clientY: rect.top + y,
    });

    element.dispatchEvent(event);
  }

  #drawJoients(keypoints) {
    for (const { x, y } of keypoints) {
      this.#canvasContext.beginPath();
      const newX = x - 2;
      const newY = y - 2;
      const radius = 3;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;

      this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle);
      this.#canvasContext.fill();
    }
  }

  #drawFingersAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLookupIndexes);
    for (const finger of fingers) {
      const points = this.#fingerLookupIndexes[finger].map(
        (index) => keypoints[index]
      );
      const region = new Path2D();
      const [{ x, y }] = points;
      region.moveTo(x, y);
      for (const point of points) {
        region.lineTo(point.x, point.y);
      }
      this.#canvasContext.stroke(region);
      this.#hoverElements(finger, points);
    }
  }

  #hoverElements(finger, points) {
    if (finger !== "indexFinger") return;

    const tip = points.find((item) => item.name === "index_finger_tip");
    const element = document.elementFromPoint(
      tip.x * this.#scalers.x,
      tip.y * this.#scalers.y
    );
    if (!element) return;
    const toggleHover = () => this.#styler.toggleStyle(element, ":hover");
    toggleHover();
    setTimeout(() => {
      toggleHover();
    }, 500);
  }

  loop(fn) {
    requestAnimationFrame(fn);
  }

  getCurrentPagePosition() {
    return document.documentElement.scrollTop;
  }

  scrollPage(top) {
    scroll({
      top,
      behavior: "smooth",
    });
  }
}
