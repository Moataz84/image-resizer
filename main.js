const { app, BrowserWindow, Menu } = require("electron")
const path = require("path")

const isWindows = process.platform !== "darwin"
const isDev = true
let window

const menu = [
  {
    label: "File",
    submenu: [
      {role: "quit"}
    ]
  },
  {
    label: "View",
    submenu: isDev? [   
      {role: "reload"},
      {role: "forceReload"},
      {role: "toggleDevTools"},
      {type: "separator"},
      {role: "resetZoom"},
      {role: "zoomIn"},
      {role: "zoomOut"},
      {type: "separator"},
      {role: "togglefullscreen"}
    ] : [
      {role: "resetZoom"},
      {role: "zoomIn"},
      {role: "zoomOut"},
      {type: "separator"},
      {role: "togglefullscreen"}
    ]
  },
  {
    label: "Help",
    submenu: [
      {
        label: "About",
        role: "about"
      }
    ]
  },
]

function createWindow() {
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "./renderer/assets/icon.png"),
    width: isDev? 1000: 800,
    height: 600,
    minWidth: 700,
    minHeight: 500,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js")
    }
  })
  
  window = mainWindow
  if (isDev) mainWindow.webContents.openDevTools()
  mainWindow.loadFile(path.join(__dirname, "./renderer/pages/index.html"))
}

app.whenReady().then(() => {
  createWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  app.setAboutPanelOptions({
    applicationName: "Image Resizer",
    applicationVersion : "Version: 1.0.0",
    credits: "Created By: Moataz Ghazy"
  })

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (isWindows) app.quit()
})