const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  addTorrent: (torrentId) => {
    console.log('addTorrent');
    ipcRenderer.send('webtorrent-action', { action: 'add-torrent', torrentId });
  },
  onTorrentProgress: (callback) => ipcRenderer.on('torrent-progress', callback),
  onTorrentDone: (callback) => ipcRenderer.on('torrent-done', callback),
  onTorrentFile: (callback) => ipcRenderer.on('torrent-file', callback),
  onTorrentError: (callback) => ipcRenderer.on('torrent-error', callback)
});
