const { spawn } = require('node:child_process');
const ffmpegPath = require('ffmpeg-static');

const camera = process.argv[2] || 'main';

const colors = {
  main: '0x13294b',
  'camera-11': '0x1d3b2a',
  'camera-12': '0x49321a',
  'camera-13': '0x3a234a',
};

const color = colors[camera] || colors.main;
const source = process.env.DEMO_VIDEO_SOURCE || `color=c=${color}:s=640x360:r=2`;

const args = [
  '-hide_banner',
  '-re',
  '-f',
  'lavfi',
  '-i',
  source,
  '-an',
  '-c:v',
  'libx264',
  '-preset',
  'ultrafast',
  '-tune',
  'zerolatency',
  '-profile:v',
  'baseline',
  '-level',
  '3.0',
  '-pix_fmt',
  'yuv420p',
  '-g',
  '2',
  '-f',
  'mpegts',
  '-mpegts_flags',
  'resend_headers',
  'pipe:1',
];

const ffmpeg = spawn(ffmpegPath, args, {
  stdio: ['ignore', 'inherit', 'inherit'],
});

function stop() {
  ffmpeg.kill('SIGTERM');
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

ffmpeg.on('exit', (code, signal) => {
  if (signal) return;
  process.exit(code ?? 0);
});
