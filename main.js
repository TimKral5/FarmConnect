const {
  app,
  BrowserWindow,
  Notification,
  dialog,
  nativeTheme,
} = require("electron");
const path = require("path");
const sv = require("./server");

const port = 8080;
sv.run({ port: 8080 });

function createWindow() {
  nativeTheme.themeSource = "dark";

  const mainWindow = new BrowserWindow({
    /*icon: path.join(__dirname, 'src/dependencies/ico/favicon.ico'),*/
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:" + port);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  //console.log(dialog.showMessageBox({message: 'test'}))
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
