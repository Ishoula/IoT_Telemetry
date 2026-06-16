# IoT Temperature Monitoring System

![IoT](https://img.shields.io/badge/IoT-Temperature%20Monitoring-00b4d8)
![Arduino](https://img.shields.io/badge/Arduino-Uno-00979D?logo=arduino&logoColor=white)
![Python](https://img.shields.io/badge/Python-MQTT%20Bridge-3776AB?logo=python&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-Realtime-orange)
![Chart.js](https://img.shields.io/badge/Chart.js-Live%20Dashboard-ff6384?logo=chartdotjs&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success)

A real-time IoT temperature monitoring system that reads temperature from an Arduino-connected DHT11 sensor, publishes the readings through MQTT, and displays them on a live web dashboard.

---

## Preview

The dashboard shows:

- Current temperature reading
- Live MQTT connection status
- Real-time temperature history graph
- Automatic updates from the sensor stream

**Live Dashboard**

```text
[http://157.173.101.159:9233/](http://157.173.101.159:9233/)
```

---

## System Overview

| Layer | Technology | Purpose |
| --- | --- | --- |
| Sensor | DHT11 | Captures temperature readings |
| Hardware Controller | Arduino Uno | Reads sensor data and sends serial output |
| Local Bridge | Python | Reads serial data and publishes MQTT messages |
| Messaging | Mosquitto / MQTT | Sends readings to subscribed clients |
| Dashboard | HTML, CSS, JavaScript, Chart.js | Displays live temperature data |
| Hosting | VPS | Runs broker and web dashboard |

---

## Architecture

The full architecture diagram is available in:

```text
system architecture.txt
```

### Data Flow

```text
DHT11 Sensor
    |
    v
Arduino Uno
    |
    | USB Serial at 9600 baud
    v
Python MQTT Bridge
    |
    | MQTT TCP on port 1883
    v
MQTT Broker: broker.benax.rw
    |
    | Topic: sensors_shoula/dht
    v
Web Dashboard
```

---

## MQTT Configuration

| Setting | Value |
| --- | --- |
| Broker | `broker.benax.rw` |
| TCP Port | `1883` |
| WebSocket URL | `ws://broker.benax.rw:9001/mqtt` |
| Topic | `sensors_shoula/dht` |
| Payload | JSON |

### Payload Example

```json
{
  "temperature": 22.8
}
```

---

## Hardware

- Arduino Uno
- DHT11 temperature sensor
- 16x2 LCD display with I2C module
- USB cable for serial communication
- PC or VPS running the Python bridge

The Arduino reads the temperature, displays it on the LCD, and sends the reading over serial communication.

---

## Software Stack

- Arduino C/C++
- Python
- `pyserial`
- `paho-mqtt`
- Mosquitto MQTT broker
- HTML
- CSS
- JavaScript
- Chart.js
- MQTT.js

---

## How To Run

### 1. Upload Arduino Code

Upload the Arduino sketch to the Arduino Uno, then confirm the board is sending temperature readings over serial at `9600` baud.

### 2. Start The Python Bridge

Install the required Python packages:

```bash
pip install pyserial paho-mqtt
```

Run the bridge:

```bash
python main.py
```

### 3. Start The Web Dashboard

From the project folder, run:

```bash
python -m http.server 9233
```

For VPS hosting:

```bash
nohup python3 -m http.server 9233 --bind 0.0.0.0 &
```

Open the dashboard:

```text
[http://157.173.101.159:9233/](http://157.173.101.159:9233/)
```

### 4. Check MQTT Broker Status

```bash
sudo systemctl status mosquitto
```

---

## Project Structure

```text
embedded/
|
├── index.html
├── styles.css
├── main.py
├── readMe.md
├── system architecture.txt
└── scripts/
    └── app.js
```

---

## Features

- Real-time temperature monitoring
- Serial communication from Arduino to Python
- MQTT publish/subscribe pipeline
- VPS-hosted dashboard
- Live Chart.js temperature graph
- Clean dashboard UI
- Warning state when no data is received

---

## Notes

- Make sure port `1883` is open for MQTT TCP traffic.
- Make sure port `9001` is open if the dashboard uses MQTT over WebSockets.
- Make sure port `9233` is open if hosting the dashboard on a VPS.
- Update the serial port in `main.py` if your Arduino is not connected on `COM7`.
- The Arduino serial monitor must be closed while `main.py` is running.

---

## Author

IoT Temperature Monitoring Project
