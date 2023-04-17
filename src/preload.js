// In the preload script.
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("EAPI", {
  startStream: (callback) => ipcRenderer.on("SET_SOURCE", callback),
  getStream: (window_count, flag) => ipcRenderer.send("GET_SOURCE_ID", window_count, flag),
  startStaticStream: (callback) => ipcRenderer.on("SET_STATIC_STREAM", callback),
  triggerCloseStream: () => ipcRenderer.send("CLOSE_STREAM"),
  closeStream: (callback) => ipcRenderer.on("CLOSE_ALL_STREAM", callback),
});
