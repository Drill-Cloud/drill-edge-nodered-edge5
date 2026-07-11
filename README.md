EDGE5
=====

Node-RED проект для буровой edge5.

## Режим работы

Один и тот же flow используется локально и на буровой. Поведение выбирается одной переменной окружения:

```env
EDGE_RUNTIME_MODE=dev
```

Допустимые значения:

- `dev` - режим локальной разработки. Включены demo Modbus, demo PLC и demo video. Реальный Modbus и реальные RTSP-камеры выключены.
- `prod` - режим буровой. Включены реальный Modbus и реальные RTSP-камеры. Все demo-источники выключены.

Если `EDGE_RUNTIME_MODE` не задан, используется режим `dev`.

## Локальная разработка

Используй этот режим на рабочем месте разработчика, где нет COM-порта и реальных RTSP-камер:

```env
EDGE_RUNTIME_MODE=dev
MODBUS_SERIAL_PORT=COM3
```

В этом режиме demo-источники публикуют данные только в demo MQTT-топики:

- `data/demo/modbus/v1`
- `data/demo/plc/v1`
- `data/demo/video/v1`
- `data/demo/video/v2/camera-11`
- `data/demo/video/v2/camera-12`
- `data/demo/video/v2/camera-13`
- `data/demo/video/v2/my-super-video`

## Буровая

Используй этот режим на буровой:

```env
EDGE_RUNTIME_MODE=prod
MODBUS_SERIAL_PORT=COM3
CAMERA_MAIN_RTSP_URL=rtsp://admin:admin@192.168.0.11:554/live/main
CAMERA_11_RTSP_URL=rtsp://admin:admin@192.168.0.11:554/live/sub
CAMERA_12_RTSP_URL=rtsp://admin:admin@192.168.0.12:554/live/sub
CAMERA_13_RTSP_URL=rtsp://admin:admin@192.168.0.13:554/live/sub
```

В этом режиме реальные источники публикуют данные в edge5 MQTT-топики:

- `data/edge5/modbus/v3`
- `data/edge5/video/v1`
- `data/edge5/video/v2/camera-11`
- `data/edge5/video/v2/camera-12`
- `data/edge5/video/v2/camera-13`

## Видео-эмулятор

Видео-эмулятор генерирует бесконечный MPEG-TS/H.264 поток и отправляет его в MQTT.

Для локального запуска используется системный `ffmpeg` из `PATH`. Если `ffmpeg` лежит в нестандартном месте, укажи путь явно:

```env
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
```

Опционально можно переопределить источник demo-видео:

```env
DEMO_VIDEO_SOURCE=rtsp://127.0.0.1:8554/demo
```

Поддерживаются три вида источников:

- `color=...`, `testsrc...`, `smptebars...` - встроенный lavfi-источник ffmpeg;
- `rtsp://...` - локальный или удаленный RTSP-поток;
- путь к файлу, например `C:\video\demo.mp4`.

## БУР-71: фильм -> RTSP -> MQTT

Сценарий для разработки без физической камеры:

1. Поднять локальный RTSP-сервер, например MediaMTX.
2. Запустить фильм в RTSP:

```bash
ffmpeg -re -stream_loop -1 -i C:\video\demo.mp4 -an -c:v libx264 -preset veryfast -tune zerolatency -f rtsp rtsp://127.0.0.1:8554/demo
```

3. В `.env` проекта указать:

```env
EDGE_RUNTIME_MODE=dev
FFMPEG_PATH=ffmpeg
DEMO_VIDEO_SCRIPT=projects/nodered-edge5/scripts/demo-video.js
DEMO_VIDEO_SOURCE=rtsp://127.0.0.1:8554/demo
```

4. Запустить Node-RED. На вкладке `Эмуляторы` поток `demo movie -> rtsp -> mqtt` автоматически отправит видео в MQTT:

```text
data/demo/video/v2/my-super-video
```

Broker для этого потока в `flows.json` настроен на:

```text
mqtt://194.36.208.86:1883
```
