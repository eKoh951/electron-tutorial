async function handleAddTorrent(torrentId) {
  const { default: WebTorrent } = await import('webtorrent');
  const client = new WebTorrent();

  client.add(torrentId, (torrent) => {
    const file = torrent.files.find(file => file.name.endsWith('.mp4'));

		if (file) {
      const url = URL.createObjectURL(file.createReadStream());
      process.parentPort.postMessage({ type: 'torrent-file', data: { url } });
    }

    torrent.on('done', () => {
      process.parentPort.postMessage({ type: 'torrent-done' });
    });

    setInterval(() => {
      process.parentPort.postMessage({
        type: 'torrent-progress',
        data: {
          numPeers: torrent.numPeers,
          downloaded: torrent.downloaded,
          total: torrent.length,
          progress: torrent.progress,
          downloadSpeed: torrent.downloadSpeed,
          uploadSpeed: torrent.uploadSpeed,
          remaining: torrent.done ? 'Done.' : moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
        }
      });
    }, 500);
  });
}

process.parentPort.on('message', (message) => {
  if (message.action === 'add-torrent') {
    handleAddTorrent(message.torrentId);
  }
});
