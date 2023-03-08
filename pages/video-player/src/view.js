export default class View {
  #btnInit;
  #statusElement;
  #videoFrameCanvas;
  #canvasContext;
  #videoElement;

  constructor() {
    this.#btnInit = document.querySelector("#init");
    this.#statusElement = document.querySelector("#status");
    this.#videoFrameCanvas = document.createElement("canvas");
    this.#canvasContext = this.#videoFrameCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    this.#videoElement = document.querySelector("#video");
  }

  getVideoFrame(video) {
    const canvas = this.#videoFrameCanvas;
    const [width, height] = [video.videoWidth, video.videoHeight];
    canvas.width = width;
    canvas.height = height;

    this.#canvasContext.drawImage(video, 0, 0, width, height);
    return this.#canvasContext.getImageData(0, 0, width, height);
  }

  playVideo() {
    this.#videoElement.play();
  }

  pauseVideo() {
    this.#videoElement.pause();
  }

  enableButton() {
    this.#btnInit.disabled = false;
  }

  configureOnBtnClick(fn) {
    this.#btnInit.addEventListener("click", fn);
  }

  log(text) {
    this.#statusElement.innerHTML = text;
  }

  setVideoSrc(url) {
    this.#videoElement.src = url;
  }
}
