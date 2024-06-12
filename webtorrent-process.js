async function handleAddTorrent(torrentId) {
  const { default: WebTorrent } = await import('webtorrent');
  const client = new WebTorrent();

  client.add(torrentId, (torrent) => {
    torrent.files.forEach(file => {
      file.getBuffer((err, buffer) => {
        if (err) throw err;
        process.parentPort.postMessage({ type: 'torrent-file', data: { name: file.name, buffer } });
      });
    });
  });
}

process.parentPort.on('message', (message) => {
  if (message.action === 'add-torrent') {
    handleAddTorrent(message.torrentId);
  }
});
