// HTML elements
const $body = document.body;
const $progressBar = document.querySelector('#progressBar');
const $numPeers = document.querySelector('#numPeers');
const $downloaded = document.querySelector('#downloaded');
const $total = document.querySelector('#total');
const $remaining = document.querySelector('#remaining');
const $uploadSpeed = document.querySelector('#uploadSpeed');
const $downloadSpeed = document.querySelector('#downloadSpeed');
const player = document.querySelector('#output');

const torrentId = 'https://webtorrent.io/torrents/sintel.torrent';

window.api.addTorrent(torrentId);

window.api.onTorrentProgress((event, data) => {
  const { numPeers, downloaded, total, progress, downloadSpeed, uploadSpeed, remaining } = data;

  $numPeers.innerHTML = numPeers + (numPeers === 1 ? ' peer' : ' peers');
  const percent = Math.round(progress * 100 * 100) / 100;
  $progressBar.style.width = percent + '%';
  $downloaded.innerHTML = prettyBytes(downloaded);
  $total.innerHTML = prettyBytes(total);
  $remaining.innerHTML = remaining;
  $downloadSpeed.innerHTML = prettyBytes(downloadSpeed) + '/s';
  $uploadSpeed.innerHTML = prettyBytes(uploadSpeed) + '/s';
});

window.api.onTorrentDone(() => {
  $body.className += ' is-seed';
});

window.api.onTorrentFile((event, data) => {
  const { url } = data;
  player.src = url;
  player.play();
});

function prettyBytes(num) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const neg = num < 0;
  if (neg) num = -num;
  if (num < 1) return (neg ? '-' : '') + num + ' B';
  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
  const unit = units[exponent];
  num = Number((num / Math.pow(1000, exponent)).toFixed(2));
  return (neg ? '-' : '') + num + ' ' + unit;
}
