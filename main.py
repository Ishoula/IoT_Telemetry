import serial
import paho.mqtt.client as mqtt
import time
import json
# ---------------- CONFIG ----------------
ser = serial.Serial('COM7', 9600, timeout=1)

MQTT_BROKER = "broker.benax.rw"
MQTT_PORT = 1883
TOPIC = "sensors_shoula/dht"

client = mqtt.Client()
client.connect(MQTT_BROKER, MQTT_PORT, 60)

print("Bridge started...")

while True:
    try:
        if ser.in_waiting > 0:
            line = ser.readline().decode().strip()

            print("RAW:", line)

            # ONLY process valid temperature lines
            if "Temperature:" in line:
                parts = line.split(":")[1].replace("C", "").strip()

                try:
                    temp = float(parts)

                    print("Parsed temperature:", temp)

                    payload = json.dumps({"temperature": temp})
                    client.publish(TOPIC, payload)
                    print("MQTT Published:", payload)

                except:
                    print("Parse error")

        time.sleep(0.1)

    except Exception as e:
        print("Error:", e)
        break