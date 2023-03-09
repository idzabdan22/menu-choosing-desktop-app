// In the preload script.
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("EAPI", {
  startStream: (callback) => ipcRenderer.on("SET_SOURCE", callback),
});
