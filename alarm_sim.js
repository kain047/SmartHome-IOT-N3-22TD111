const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let gasLevel = 150;   // bắt đầu từ 150ppm

setInterval(async () => {
  
  // tăng dần mức gas cho đến ngưỡng nguy hiểm
  gasLevel += Math.random() * 30 + 10;

  if (gasLevel > 600) gasLevel = 600; // giới hạn trần

  try {
    const res = await fetch("http://localhost:3000/api/sensors/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sensorId: 4,   // sensor GAS
        value: gasLevel.toFixed(2)
      })
    });

    const data = await res.json();
    console.log(`⚠️ ALARM → GAS: ${gasLevel.toFixed(2)} ppm (${data.message})`);

  } catch (err) {
    console.error("❌ Lỗi khi gửi GAS ALARM:", err.message);
  }

}, 2000);
