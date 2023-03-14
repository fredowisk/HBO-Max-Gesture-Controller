export default class Controller {
  #view;
  #worker;
  #camera;
  #blinkCounter;

  constructor({ view, worker, camera }) {
    this.#view = view;
    this.#worker = this.#configureWorker(worker);
    this.#camera = camera;
    this.#blinkCounter = 0;

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this));
    this.#view.configureOnVideoClick(this.onVideoClick.bind(this));
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    controller.log("Not yet detecting eye blink! Click in start button!");
    controller.init();
  }

  #configureWorker(worker) {
    let ready = false;
    worker.onmessage = ({ data }) => {
      if (data === "READY") {
        console.log("Worker is ready!");
        this.#view.enableButton();
        ready = true;
        return;
      }

      const blinked = data.blinked;
      this.#blinkCounter++;
      blinked === "left" ? this.#view.playVideo() : this.#view.pauseVideo();
      console.log("Blinked!", blinked);
    };

    return {
      send(msg) {
        if (!ready) return;
        worker.postMessage(msg);
      },
    };
  }

  init() {
    console.log("Initializing controller!");
  }

  loop() {
    const video = this.#camera.video;
    const image = this.#view.getVideoFrame(video);
    this.#worker.send(image);
    this.log("Detecting eye blink...");

    setTimeout(() => this.loop(), 500);
  }

  log(text) {
    const times = `           - blinked times: ${this.#blinkCounter}`;
    this.#view.log(`status: ${text}`.concat(this.#blinkCounter ? times : ""));
  }

  onBtnStart() {
    this.log("Initializing detection!");
    this.#blinkCounter = 0;
    this.loop();
  }

  onVideoClick() {
    this.#view.isVideoPaused() === true
      ? this.#view.playVideo()
      : this.#view.pauseVideo();
  }
}
