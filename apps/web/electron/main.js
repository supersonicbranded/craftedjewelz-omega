// apps/web/electron/main.js
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");

let mainWindow;

// Persistent in-memory store for diamond settings
let diamondSettings = {
  defaultSize: 1.5, // mm
  spacing: 0.2,     // mm
  cutStyle: "round",
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "../../build/icons/app.png"), // updated branding
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

// File handling
ipcMain.handle("file:save", async (_event, { data, defaultPath }) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: defaultPath || "craftedjewelz-design.stl",
    filters: [{ name: "3D Models", extensions: ["stl", "obj", "glb"] }],
  });

  if (filePath) {
    fs.writeFileSync(filePath, data);
    return { success: true, path: filePath };
  }
  return { success: false };
});

ipcMain.handle("file:open", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "3D Models", extensions: ["stl", "obj", "glb"] }],
    properties: ["openFile"],
  });

  if (!canceled && filePaths.length > 0) {
    const fileData = fs.readFileSync(filePaths[0], "utf-8");
    return { success: true, data: fileData, path: filePaths[0] };
  }
  return { success: false };
});

// Diamond settings
ipcMain.handle("cad:getDiamondSettings", async () => diamondSettings);
ipcMain.handle("cad:setDiamondSettings", async (_event, settings) => {
  diamondSettings = { ...diamondSettings, ...settings };
  return diamondSettings;
});

// Auto-updater
ipcMain.on("update:check", () => {
  autoUpdater.checkForUpdates();
});

autoUpdater.on("update-available", (info) => {
  if (mainWindow) {
    mainWindow.webContents.send("update:available", info);
  }
});
autoUpdater.on("update-downloaded", (info) => {
  if (mainWindow) {
    mainWindow.webContents.send("update:downloaded", info);
  }
});

// App version
ipcMain.handle("app:getVersion", () => app.getVersion());

// App lifecycle
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

