process.env.DIST = join(__dirname, '../..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'
import dotenv from "dotenv"
dotenv.config({ path: join(process.env.DIST,`../.env.${ process.env.NODE_ENV }`) })
ipcMain.handle("get_node_env",()=>{
  return process.env.NODE_ENV??"undefined"
})
ipcMain.handle("get_main_token",()=>{
  return process.env.MAIN_TOKEN??"undefined"
})

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL as string
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    }, 
  })
  
  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }
  
  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)
