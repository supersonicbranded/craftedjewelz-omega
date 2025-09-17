import { app, BrowserWindow, ipcMain, nativeTheme, shell } from "electron";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let splashWindow = null;
let mainWindow = null;

const isDev = !!process.env.VITE_DEV_SERVER_URL;

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 560,
    height: 360,
    frame: false,
    resizable: false,
    movable: true,
    transparent: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#09090b" : "#ffffff",
    show: false,
    alwaysOnTop: true
  });

  // Load local splash.html that we ship via extraResources
  splashWindow.loadFile(path.join(app.getAppPath(), "splash.html")).catch(() => {});
  splashWindow.once("ready-to-show", () => splashWindow.show());
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#0b0b0d" : "#f7f7f8",
    show: false,
    title: "CraftedJewelz",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Vite build output goes to /dist
    const indexPath = path.join(app.getAppPath(), "dist", "index.html");
    mainWindow.loadFile(indexPath);
  }

  mainWindow.once("ready-to-show", () => {
    // Give splash some time for a premium feel, then show main.
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
      splashWindow = null;
      mainWindow.show();
    }, 900);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createSplash();
  createMainWindow();

  // Auto-update event handlers
  autoUpdater.on("update-available", () => {
    if (mainWindow) mainWindow.webContents.send("update_available");
  });
  autoUpdater.on("update-downloaded", () => {
    if (mainWindow) mainWindow.webContents.send("update_downloaded");
  });
  autoUpdater.on("error", (err) => {
    if (mainWindow) mainWindow.webContents.send("update_error", err == null ? "Unknown error" : err.message);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplash();
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Simple ping for preload health-check
ipcMain.handle("app:ping", () => "pong");



