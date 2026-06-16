// ---------------- MQTT CONFIG ----------------
const broker = "ws://broker.benax.rw:9001/mqtt"; // IMPORTANT: WebSocket
const topic = "sensors_shoula/dht";

const client = mqtt.connect(broker);

// ---------------- CHART ----------------
const ctx = document.getElementById("chart").getContext("2d");

// 1. Create a beautiful vertical fade gradient for the area fill
const chartGradient = ctx.createLinearGradient(0, 0, 0, 400);
chartGradient.addColorStop(0, "rgba(0, 180, 216, 0.25)"); // Vibrant sky blue with opacity at the top
chartGradient.addColorStop(0.5, "rgba(0, 180, 216, 0.05)"); // Soft glow in the middle
chartGradient.addColorStop(1, "rgba(11, 19, 43, 0)"); // Completely fades to your deep background color

const tempChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // Populated by your MQTT stream (e.g., ["10:00", "10:01", "10:02"])
    datasets: [{
      label: "Temperature",
      data: [], // Populated by your MQTT data stream

      // Line Styling
      borderColor: "#00b4d8", // Crisp, sharp sky blue line
      borderWidth: 3,
      tension: 0.4, // Gives that smooth, premium organic wave curve

      // Area Fill Styling
      fill: true,
      backgroundColor: chartGradient,

      // Data Point Styling (Clean dots that appear seamlessly)
      pointBackgroundColor: "#1c2541", // Matches card background to look hollow
      pointBorderColor: "#90e0ef", // Bright outer ring
      pointBorderWidth: 2,
      pointRadius: 0, // Hide points by default for a clean line
      pointHoverRadius: 6, // Make points scale up smoothly on hover
      pointHoverBorderWidth: 3,
      pointHoverBackgroundColor: "#00b4d8"
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

    // Custom interaction settings
    interaction: {
      intersect: false,
      mode: "index"
    },

    plugins: {
      legend: {
        display: false // Text headers already state what it is; keep the canvas clean
      },

      // 2. High-end Custom Tooltip Design
      tooltip: {
        backgroundColor: "#1c2541", // Matches your deep blue card background
        titleColor: "#90e0ef", // Sky blue titles
        bodyColor: "#f1faee", // Crisp white values
        bodyFont: {
          family: "system-ui",
          size: 14,
          weight: "600"
        },
        padding: 12,
        borderColor: "#3a506b", // Matches card borders
        borderWidth: 1,
        borderRadius: 8,
        displayColors: false, // Remove the unnecessary colored square
        callbacks: {
          label: function (context) {
            return ` ${context.parsed.y.toFixed(2)} °C`; // Formats value neatly
          }
        }
      }
    },

    // 3. Clean, Minimalist Axis Layout
    scales: {
      x: {
        grid: {
          display: false // Hiding vertical lines removes layout clutter entirely
        },
        ticks: {
          color: "#48cae4", // Soft sky blue labels
          font: {
            family: "system-ui",
            size: 11
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6 // Prevents labels from crowding over time
        }
      },
      y: {
        min: 20,
        max: 30,
        grid: {
          color: "rgba(58, 80, 107, 0.3)", // Very subtle horizontal dash guides
          drawBorder: false
        },
        border: {
          dash: [5, 5] // Elegant dashed grid lines instead of solid walls
        },
        ticks: {
          color: "#48cae4",
          font: {
            family: "system-ui",
            size: 11
          },
          callback: function (value) {
            return Number(value).toFixed(2) + "°"; // Append degree symbol directly to axis
          }
        }
      }
    }
  }
});

let lastDataTime = Date.now();

function updateYAxisRange(values) {
  if (values.length === 0) {
    return;
  }

  const minTemp = Math.min(...values);
  const maxTemp = Math.max(...values);
  const padding = Math.max((maxTemp - minTemp) * 0.25, 0.5);

  tempChart.options.scales.y.min = Math.floor((minTemp - padding) * 10) / 10;
  tempChart.options.scales.y.max = Math.ceil((maxTemp + padding) * 10) / 10;
}

// ---------------- CONNECT ----------------
client.on("connect", function () {
  document.getElementById("status").innerText = "Dashboard Online";
  client.subscribe(topic);
  console.log("Subscribed to:", topic);
});

// ---------------- MESSAGE ----------------
client.on("message", function (topic, message) {
  try {
    const data = JSON.parse(message.toString());
    const temp = Number(data.temperature);

    if (Number.isNaN(temp)) {
      throw new Error("Invalid temperature value");
    }

    console.log("Temp:", temp);

    document.getElementById("temp").innerText = temp.toFixed(2);

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    tempChart.data.labels.push(now);
    tempChart.data.datasets[0].data.push(temp);
    updateYAxisRange(tempChart.data.datasets[0].data);

    tempChart.update();

    lastDataTime = Date.now();
  } catch (e) {
    console.error("Parse error:", e);
  }
});

// ---------------- WATCHDOG ----------------
setInterval(() => {
  if (Date.now() - lastDataTime > 25000) {
    document.getElementById("status").innerText = "WARNING: No Data Received";
    document.getElementById("status").style.color = "orange";
  }
}, 10000);
