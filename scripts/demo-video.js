const { spawn } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const projectEnvPath = join(__dirname, '..', '.env');

function loadProjectEnv() {
  if (!existsSync(projectEnvPath)) return;

  const rows = readFileSync(projectEnvPath, 'utf8').split(/\r?\n/);
  for (const row of rows) {
    const line = row.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex < 1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadProjectEnv();

const camera = process.argv[2] || 'main';

const colors = {
  main: '0x13294b',
  'camera-11': '0x1d3b2a',
  'camera-12': '0x49321a',
  'camera-13': '0x3a234a',
};

const color = colors[camera] || colors.main;
const cameraEnvName = `DEMO_VIDEO_SOURCE_${camera.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
const source = process.env[cameraEnvName] || process.env.DEMO_VIDEO_SOURCE || `color=c=${color}:s=640x360:r=2`;
const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';

function isLavfiSource(value) {
  return value.startsWith('color=') || value.startsWith('testsrc') || value.startsWith('smptebars');
}

function isRtspSource(value) {
  return value.startsWith('rtsp://') || value.startsWith('rtsps://');
}

function buildInputArgs(value) {
  if (isLavfiSource(value)) {
    return ['-re', '-f', 'lavfi', '-i', value];
  }

  if (isRtspSource(value)) {
    return ['-rtsp_transport', 'tcp', '-i', value];
  }

  return ['-re', '-stream_loop', '-1', '-i', value];
}

const args = [
  '-hide_banner',
  ...buildInputArgs(source),
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
