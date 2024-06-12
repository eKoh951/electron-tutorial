const { app, BrowserWindow, ipcMain, utilityProcess } = require('electron');
const path = require('path');

let mainWindow;
let webTorrentProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Iniciar el proceso separado para WebTorrent usando utilityProcess
  webTorrentProcess = utilityProcess.fork(path.join(__dirname, 'webtorrent-process.js'));

  // Manejar mensajes desde el proceso WebTorrent
  webTorrentProcess.on('message', (message) => {
    if (message.type === 'torrent-file') {
      mainWindow.webContents.send('torrent-file', message.data);
    }
  });

  // Reenviar mensajes desde el renderizador al proceso WebTorrent
  ipcMain.on('webtorrent-action', (event, arg) => {
    webTorrentProcess.postMessage(arg);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
