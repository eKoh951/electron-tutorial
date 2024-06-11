const { app, BrowserWindow } = require('electron')
let ward = 0

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
	createWindow()
	
	ward += 1
	app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
	ward += 1
})

app.on('window-all-closed', () => {
	ward += 1

  if (process.platform !== 'darwin') app.quit()
})