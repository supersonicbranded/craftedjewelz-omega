const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
    icon: path.join(__dirname, "../build/icons/appicon.png")
  });

  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.on("ready", createWindow);

// IPC Handlers
ipcMain.handle("get-version", () => app.getVersion());
ipcMain.handle("save-file", async (_, data) => {
  const { filePath } = await dialog.showSaveDialog({
    filters: [{ name: "JSON", extensions: ["json"] }]
  });
  if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return "saved";
  }
  return "cancelled";
});

ipcMain.handle("open-file", async () => {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "JSON", extensions: ["json"] }]
  });
  if (filePaths.length > 0) {
    return fs.readFileSync(filePaths[0], "utf-8");
  }
  return null;
});

ipcMain.handle("check-for-updates", () => {
  return "update-check-stub";
});


