document.getElementById('add-torrent-btn').addEventListener('click', () => {
  const torrentId = document.getElementById('torrent-id-input').value;
  window.api.addTorrent(torrentId);
});

window.api.onTorrentFile((event, { name, buffer }) => {
  const blob = new Blob([buffer]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
});
