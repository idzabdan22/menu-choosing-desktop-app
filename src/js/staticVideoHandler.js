window.addEventListener("load", (e) => {
  const videoElement = document.querySelectorAll("video");
  const webcamUID = "(046d:0825)";
  const loading = document.querySelectorAll(".loading");
  let stream = "";

  const handleStream = (stream) => {
    loading[0].style.opacity = "0%";
    videoElement[0].srcObject = stream;
    videoElement[0].onloadedmetadata = (e) => videoElement[0].play();
  };

  window.EAPI.closeStream(async (_event) => {
    stream.getVideoTracks()[0].stop();
    videoElement[0].srcObject = null;
    // loading[0].style.opacity = "100%";
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
