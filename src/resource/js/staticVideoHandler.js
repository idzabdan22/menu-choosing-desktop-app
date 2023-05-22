window.addEventListener("load", (e) => {
  const frontCamera = document.querySelector("#front-camera");
  const loading = document.querySelector("#loading-front");
  //const webcamUID = "(046d:0825)";
  const webcamUID = "(046d:082d)";
  let stream = "";

  const handleStream = (stream) => {
    loading.style.opacity = "0%";
    frontCamera.srcObject = stream;
    frontCamera.onloadedmetadata = (e) => frontCamera.play();
  };

  window.EAPI.closeStream(async (_event) => {
    stream.getVideoTracks()[0].stop();
    frontCamera.srcObject = null;
  });

  async function getDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices);
      const source = devices.find(
        (device) =>
          device.kind === "videoinput" && device.label.includes(webcamUID)
      );
      return source.deviceId;
    } catch (error) {
      console.log(error);
    }
  }

  window.EAPI.startStaticStream(async (_event) => {
    try {
      const source = await getDevices();
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            sourceId: source,
          },
        },
      });
      handleStream(stream);
    } catch (error) {
      console.log(error);
    }
  });
});
