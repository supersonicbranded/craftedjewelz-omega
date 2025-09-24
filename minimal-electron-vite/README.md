# Minimal Electron + Vite Project

A clean, working Electron + Vite project that properly loads `dist/index.html` in production builds.

## Setup

1. Install dependencies:
```bash
npm install
```

## Development

Run in development mode (with Vite dev server):
```bash
npm run electron-dev
```

## Production Build & Package

1. Build the frontend:
```bash
npm run build
```

2. Package the Electron app:
```bash
npm run dist
```

The packaged app will be in the `dist-electron` folder.

## Key Features

- **Correct file loading**: Loads `dist/index.html` in production, Vite dev server in development
- **Security**: Uses preload.js with contextIsolation enabled
- **Build config**: Properly configured electron-builder settings
- **Clean structure**: Minimal but complete setup

## File Structure

```
minimal-electron-vite/
├── main.js              # Electron main process
├── preload.js           # Electron preload script
├── index.html           # HTML entry point
├── package.json         # Dependencies and build scripts
├── vite.config.js       # Vite configuration
└── src/
    ├── main.js          # Frontend JavaScript
    └── style.css        # Frontend styles
```

This project demonstrates the correct way to set up Electron + Vite builds to avoid the "Not allowed to load local resource" error.
