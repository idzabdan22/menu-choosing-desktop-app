const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");
const path = require("path");

const targetWindow = ["frame1", "frame2"];
let target = "";
let toBeSent = "";

const setSingleOutputSources = async () => {
  do {
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
    toBeSent = sources.find((source) => source.name === targetWindow[0]);
    console.log("finding...");
  } while (!toBeSent);
  return [toBeSent.id];
};

const setMultipleOutputSource = async () => {
  do {
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
    target = sources.filter((source) => targetWindow.includes(source.name));
    console.log("finding...");
  } while (target.length < 2);
  toBeSent = target.map((el) => el.id);
  return toBeSent;
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 650,
    height: 400,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("CLOSE_STREAM", async (_event) => {
    try {
      win.webContents.send("CLOSE_ALL_STREAM");
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.on("GET_SOURCE_ID", async (_event, window_count, flag) => {
    try {
      if (window_count < 2) {
        if (flag) {
          win.webContents.send("SET_STATIC_STREAM");
        } else {
          source = await setSingleOutputSources();
          win.webContents.send("SET_SOURCE", source, flag, true);
        }
      } else {
        if (flag) {
          win.webContents.send("SET_STATIC_STREAM");
          source = await setSingleOutputSources();
          win.webContents.send("SET_SOURCE", source, flag, false);
        } else {
          source = await setMultipleOutputSource();
          win.webContents.send("SET_SOURCE", source, flag, false);
        }
      }
      // 1 camera 1 output {
      //  window_count: 2,
      //  flag: true
      // }
      // 2 output {
      //  window_count: 2,
      //  flag: false
      // }
      // 1 output {
      //  window_count: 1,
      //  flag: false
      // }
      // 1 camera{
      //  window_count: 1,
      //  flag: true
      // }
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
