const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require("electron")
const path = require("path")
const fs = require("fs")

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
  window.loadFile(path.join(__dirname, "./renderer/pages/index.html"))
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

ipcMain.on("photo-selected", (e, {dataURL, name}) => {
  window.loadFile(path.join(__dirname, "./renderer/pages/edit.html"), {query: {dataURL, name}})
})

ipcMain.on("cancel", () => {
  window.loadFile(path.join(__dirname, "./renderer/pages/index.html"))
})

ipcMain.on("save-image", async (e, {dataURL, name}) => {
  const extensions = ["jpg", "jpeg", "png", "gif"]
  name = name.split(".")[0]
  const directory = await dialog.showSaveDialog({
    title: "Save Image",
    defaultPath: `${name}.jpg`,
    filters: [
      {name: "Image Files", extensions}
    ]
  })

  if (directory.canceled) return
  let filePath = directory.filePath

  const buffer = Buffer.from(dataURL.split(",")[1], "base64")
  fs.writeFileSync(filePath, buffer)
  shell.openPath(filePath)
})