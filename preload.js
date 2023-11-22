const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("ipc", {
  send: (channel, data = null) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
})