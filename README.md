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

Видео-эмулятор генерирует минимальный бесконечный MPEG-TS/H.264 поток со статичным кадром.

Для локального запуска используется `ffmpeg-static` из зависимостей проекта, поэтому системный `ffmpeg` в `PATH` не обязателен.

Опционально можно переопределить источник demo-видео:

```env
DEMO_VIDEO_SOURCE=color=c=0x13294b:s=640x360:r=2
```
