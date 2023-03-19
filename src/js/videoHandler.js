window.addEventListener("load", (e) => {
  const videoElement = document.querySelector("video");
  const cam2 = document.querySelector(".camera-body");

  const handleStream = (stream) => {
    const loading = document.querySelector(".loading");
    loading.style.opacity = "0%";
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = (e) => videoElement.play();
  };

  // windows.EAPI.openFrontCamera(async (_event) => {

  // });

  window.EAPI.startStream(async (_event, sourceId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,

            // minWidth: 720,
            // minHeight: 600,
            maxWidth: 600,
            maxHeight: 500,
          },
        },
      });
      handleStream(stream);
    } catch (error) {
      console.log(error);
    }
  });
});
