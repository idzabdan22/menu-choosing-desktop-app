window.addEventListener("load", (e) => {
  const videoElement = document.querySelectorAll("video");
  let stream = "";
  const loading = document.querySelectorAll(".loading");

  const handleStream = (stream) => {
    loading[1].style.opacity = "0%";
    videoElement[1].srcObject = stream;
    videoElement[1].onloadedmetadata = (e) => videoElement[1].play();
  };

  window.EAPI.closeStream(async (_event) => {
    stream.getVideoTracks()[0].stop();
    videoElement[1].srcObject = null;
    // loading[1].style.opacity = "100%";
  });

  window.EAPI.startStream(async (_event, sourceId) => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,
          },
        },
      });
      handleStream(stream);
    } catch (error) {
      console.log(error);
    }
  });
});
