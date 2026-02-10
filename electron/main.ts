import { app, BrowserWindow } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist-electron
// │ │ ├── main
// │ │ │   └── index.js
// │ │ └── preload
// │ │       └── index.js
// │ │
// │ ├─┬ dist
// │ │ └── index.html
// │
process.env.DIST = path.join(__dirname, '../dist')

let win: BrowserWindow | null = null

const preload = path.join(__dirname, './preload.js')
const isDev = process.env.NODE_ENV !== 'production'
const url = 'http://127.0.0.1:5555'
const indexHtml = path.join(process.env.DIST, 'index.html')

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
    win.loadURL(url)
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
