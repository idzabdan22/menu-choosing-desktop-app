window.addEventListener("load", (e) => {
  const rearCamera = document.querySelector("#rear-camera");
  const loading = document.querySelector("#loading-rear");
  const webcamUID = "(046d:0825)";
  let stream = "";

  const handleStream = (stream) => {
    loading.style.opacity = "0%";
    rearCamera.srcObject = stream;
    rearCamera.onloadedmetadata = (e) => rearCamera.play();
  };

  window.EAPI.closeStream(async (_event) => {
    stream.getVideoTracks()[0].stop();
    rearCamera.srcObject = null;
  });

  async function getDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
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
