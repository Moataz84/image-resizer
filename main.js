const { app, BrowserWindow, Menu } = require("electron")
const path = require("path")

const isWindows = process.platform !== "darwin"
const isDev = process.env.NODE_ENV !== "production"

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
      {role: "about"}
    ]
  },
]

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: !isDev? 800 : 1000,
    height: 600,
    icon: path.join(__dirname, "./renderer/assets/icon.png")
  })
  
  if (isDev) mainWindow.webContents.openDevTools()

  mainWindow.loadFile(path.join(__dirname, "./renderer/pages/index.html"))
}

app.whenReady().then(() => {
  createWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (isWindows) app.quit()
})