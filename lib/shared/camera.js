export default class Camera {
  constructor() {
    this.video = document.createElement("video");
  }

  static async init() {
    if (!navigator?.mediaDevices.getUserMedia) {
      throw new Error(
        `Browser API navigator.mediaDevices.getUserMedia not available!`
      );
    }

    
    //this config get the browser default camera
    const videoConfig = {
      audio: false,
      video: true,
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

    const camera = new Camera();
    camera.video.srcObject = stream;

    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(camera.video);
      };
    });

    camera.video.play();

    return camera;
  }
}
