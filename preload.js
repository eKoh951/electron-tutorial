const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  addTorrent: (torrentId) => {
    ipcRenderer.send('webtorrent-action', { action: 'add-torrent', torrentId });
  },
  onTorrentFile: (callback) => ipcRenderer.on('torrent-file', callback)
});
