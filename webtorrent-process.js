// webtorrent-process.js
async function handleAddTorrent(torrentId) {
  console.log('handleAddTorrent');
  const { default: WebTorrent } = await import('webtorrent');
  const client = new WebTorrent();

  console.log('client.add before');
  client.add(torrentId, async (torrent) => {
    console.log('client.add start');
    const file = torrent.files.find(file => file.name.endsWith('.mp4'));

		 if (file) {
      const stream = file.createReadStream();
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);
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
          // remaining: torrent.done ? 'Done.' : moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
          remaining: 'remaining'
        }
      });
    }, 500);
  }).on('error', (err) => {
    console.error('Error adding torrent:', err);
    process.parentPort.postMessage({ type: 'torrent-error', data: { message: err.message } });
  });
}

process.parentPort.on('message', (message) => {
  console.log('message: ', message);
  if (message.data.action === 'add-torrent') {
    handleAddTorrent(message.data.torrentId);
  }
});
