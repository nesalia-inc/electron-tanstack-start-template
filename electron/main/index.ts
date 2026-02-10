import { app, BrowserWindow } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ out
// │ │ ├── main
// │ │ │   └── index.js
// │ │ └── preload
// │ │       └── index.mjs
// │ │
// │ ├─┬ dist
// │ │ └── index.html
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(__dirname, '../public')
  : path.join(__dirname, '../dist/public')

let win: BrowserWindow | null = null

const preload = path.join(__dirname, '../preload/index.mjs')
const isDev = process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL
const url = 'http://localhost:5173'
const indexHtml = path.join(process.env.DIST, 'index-electron.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'TanStack Start + Electron',
    width: 1200,
    height: 800,
    webPreferences: {
      preload,
      // Disable in production for security
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Open DevTools in development
  if (isDev) {
    win.webContents.openDevTools()
  }

  // Development: load from dev server
  // Production: load from built files
  if (isDev) {
    // Wait a bit for the dev server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000))
    win.loadURL(url).catch((err) => {
      console.error('Failed to load URL:', err)
      // Fallback to loading the file
      win?.loadFile(indexHtml)
    })
  } else {
    win.loadFile(indexHtml)
  }

  win.on('closed', () => {
    win = null
  })
}

// When the app is ready, create the window
app.on('ready', createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null && app.isReady()) {
    createWindow()
  }
})
