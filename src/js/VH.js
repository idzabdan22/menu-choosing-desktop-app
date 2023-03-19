window.addEventListener("load", (e) => {
  const videoElement = document.querySelector("video");
  const cam2 = document.querySelector(".camera-body");

  const handleStream = (stream) => {
    const loading = document.querySelector(".loading");
    loading.style.opacity = "0%";
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = (e) => videoElement.play();
  };

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
  }

  getDevices();
  // const startStream = () => {
  // };
});
