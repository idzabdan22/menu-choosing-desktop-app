window.addEventListener("load", (e) => {
  // const allCamera = document.querySelectorAll("video");
  const frontCamera = document.querySelector("#front-camera");
  const rearCamera = document.querySelector("#rear-camera");
  const loadingF = document.querySelector("#loading-front");
  const loadingR = document.querySelector("#loading-rear");
  // const loading = document.querySelectorAll(".loading");
  const streams = [];
  let stream = "";

  const handleStream = (stream, index) => {
    if (index === 'rear') {
      loadingR.style.opacity = '0%';
      rearCamera.srcObject = stream;
      rearCamera.onloadedmetadata = (e) => rearCamera.play();
    }
    // loading[index].style.opacity = "0%";
    // allCamera[index].srcObject = stream;
    // allCamera[index].onloadedmetadata = (e) => allCamera[index].play();
    // if (isSingleNoCam) {
    //   console.log("TRUEEEEEEE");
    //   loading[1].style.opacity = "0%";
    //   allCamera[1].srcObject = stream;
    //   allCamera[1].onloadedmetadata = (e) => allCamera[1].play();
    // } else {
    // }
  };

  window.EAPI.closeStream(async (_event) => {
    for (let index = 0; index < streams.length; index++) {
      // streams[index].getVideoTracks()[index].stop();
      allCamera[index].srcObject = null;
      loading[index].style.opacity = "0%";
    }
    // streams.forEach((stream) => {
    // });
    // streams[0].getVideoTracks()[0].stop();
    // allCamera[1].srcObject = null;
  });

  window.EAPI.startStream(async (_event, sourceId, flag, isSingleNoCam) => {
    try {
      if (flag) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: sourceId[0],
            },
          },
        });
        handleStream(stream, 'rear');
      } else {
        if (isSingleNoCam) {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: sourceId[0],
              },
            },
          });
          handleStream(stream, 'rear');
        } else {
          for (let index = 0; index < sourceId.length; index++) {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: sourceId[index],
                },
              },
            });
            handleStream(stream, index);
            streams.push(stream);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
});
