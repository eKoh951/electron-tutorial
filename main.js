const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('node:path')
require('update-electron-app')()

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
	createWindow()
	ipcMain.handle('ping', () => 'pong')

	app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})