// import { app, BrowserWindow } from "electron";
const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");
const path = require("path");

const targetWindow = "frame";
let target = "";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 650,
    height: 400,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("GET_SOURCE_ID", async (_event) => {
    try {
      do {
        const sources = await desktopCapturer.getSources({
          types: ["window", "screen"],
        });
        target = sources.find((source) => source.name === targetWindow);
        console.log("finding...");
      } while (!target);
      win.webContents.send("SET_SOURCE", target.id);
    } catch (error) {
      console.log(error);
    }
  });

  // RENDER BROWSER
  win.loadFile("src/template/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit(); //closed all window (only in windows and linux)
});
