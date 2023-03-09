// import { app, BrowserWindow } from "electron";
const { app, BrowserWindow, desktopCapturer } = require("electron");
const path = require("path");

const mirrorWindowName = "frame";
let browserWindow = null;

const getDesktopCaptureSource = async (browserWindow) => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
    sources.forEach((source) => {
      if (source.name === mirrorWindowName) {
        console.log(source.name);
        console.log(source.id);
        // for (let index = 0; index < 10; index++) {
        //   browserWindow.webContents.send("SET_SOURCE", source.id);
        // }
          
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("src/empty.html")
  // win.loadFile("src/index.html");
  // win.loadFile("src/index_copy.html");
  //   win.maximize()
  browserWindow = win;
  return win;
};

app.whenReady().then(() => {
  const win = createWindow();
  getDesktopCaptureSource(win);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit(); //closed all window (only in windows and linux)
});
