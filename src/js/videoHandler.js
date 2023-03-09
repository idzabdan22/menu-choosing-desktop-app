window.addEventListener("load", (e) => {
  const videoElement = document.querySelector("video");
  // alert("Connection Established");

  const handleStream = (stream) => {
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = (e) => videoElement.play();
  };

  window.EAPI.startStream(async (_event, sourceId) => {
    try {
      console.log("NYALA NIH");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,

            // minWidth: 720,
            // maxWidth: 720,
            // minHeight: 600,
            // maxHeight: 600,
          },
        },
      });
      handleStream(stream);
    } catch (error) {
      console.log(error);
    }
  });
});
