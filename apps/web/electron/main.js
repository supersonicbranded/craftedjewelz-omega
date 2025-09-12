// apps/web/electron/main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
    icon: path.join(__dirname, "../build/icons/app.png") // ✅ your app icon
  });

  // Load the built frontend
  win.loadFile(path.join(__dirname, "../dist/index.html"));

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

