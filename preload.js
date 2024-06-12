const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  addTorrent: (torrentId) => {
    ipcRenderer.send('webtorrent-action', { action: 'add-torrent', torrentId });
  },
  onTorrentProgress: (callback) => ipcRenderer.on('torrent-progress', callback),
  onTorrentDone: (callback) => ipcRenderer.on('torrent-done', callback),
  onTorrentFile: (callback) => ipcRenderer.on('torrent-file', callback)
});
