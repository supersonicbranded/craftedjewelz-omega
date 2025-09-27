const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#1e1e1e", // sleek dark background like Photoshop
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, "build/icons/appicon2.png")
  });

  // In development, load from Vite dev server
  // Multiple ways to detect development mode
  const isDev = !app.isPackaged || process.env.NODE_ENV === 'development' || process.defaultApp;

  console.log('Development mode detection:', {
    isPackaged: app.isPackaged,
    nodeEnv: process.env.NODE_ENV,
    defaultApp: process.defaultApp,
    isDev: isDev
  });

  if (isDev) {
    // Add error handling for development mode
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      if (validatedURL.includes('localhost:5173')) {
        console.log('Waiting for Vite dev server to start...');
        setTimeout(() => {
          mainWindow.loadURL('http://localhost:5173');
        }, 1000);
      }
    });

    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
