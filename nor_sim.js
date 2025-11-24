const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const sensors = [
  { id: 1, type: 'Temperature', min: 24, max: 28 },
  { id: 2, type: 'Humidity', min: 55, max: 90 },
  { id: 3, type: 'PM2.5', min: 8, max: 40 },
  { id: 4, type: 'Gas', min: 0, max: 10 }  // GAS bình thường
];

setInterval(async () => {
  for (const s of sensors) {

    let value = (Math.random() * (s.max - s.min) + s.min).toFixed(2);

    try {
      const res = await fetch('http://localhost:3000/api/sensors/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorId: s.id, value })
      });

      const data = await res.json();
      console.log(`✅ NORMAL → ${s.type}: ${value} (${data.message})`);

    } catch (err) {
      console.error(`❌ Lỗi khi gửi ${s.type}:`, err.message);
    }
  }
}, 5000);
