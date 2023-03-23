// In the preload script.
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("EAPI", {
  startStream: (callback) => ipcRenderer.on("SET_SOURCE", callback),
  getStream: () => ipcRenderer.send("GET_SOURCE_ID"),
  startStaticStream: (callback) => ipcRenderer.on("SET_STATIC_STREAM", callback),
  triggerCloseStream: () => ipcRenderer.send("CLOSE_STREAM"),
  closeStream: (callback) => ipcRenderer.on("CLOSE_ALL_STREAM", callback),
});
