import { app, BrowserWindow, nativeImage, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.VITE_DEV_SERVER === "true";

let splashWin = null;
let mainWin = null;

function loadIcon(file) {
  try {
    const p = path.resolve(__dirname, "..", "build", "icons", file);
    const img = nativeImage.createFromPath(p);
    return img.isEmpty() ? undefined : img;
  } catch {
    return undefined;
  }
}

async function createSplash() {
  splashWin = new BrowserWindow({
    width: 640,
    height: 360,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    icon: loadIcon(process.platform === "win32" ? "appicon.ico" : "appicon.png")
  });

  const splashUrl = new URL("../splash.html", import.meta.url).toString();
  await splashWin.loadURL(splashUrl);
  splashWin.once("ready-to-show", () => splashWin?.show());
}

async function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1100,
    minHeight: 720,
    show: false,
    backgroundColor: "#0b0b0c",
    title: "CraftedJewelz",
    icon: loadIcon(process.platform === "win32" ? "appicon.ico" : "appicon.png"),
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  if (isDev) {
    await mainWin.loadURL("http://localhost:5173");
    mainWin.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexHtml = new URL("../dist/index.html", import.meta.url).toString();
    await mainWin.loadURL(indexHtml);
  }

  mainWin.once("ready-to-show", () => {
    mainWin?.show();
    if (splashWin) {
      splashWin.close();
      splashWin = null;
    }
  });
}

app.on("ready", async () => {
  await createSplash();
  // Simulate loading for 1200ms then open main window
  setTimeout(async () => {
    await createMainWindow();
  }, 1200);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

// Example IPC if you need it later
ipcMain.handle("app:getVersion", () => app.getVersion());





