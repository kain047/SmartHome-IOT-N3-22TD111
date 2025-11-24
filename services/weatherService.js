// services/weatherService.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const CACHE_TIME = 5 * 60 * 1000; // cache 5 phút
let cache = null;
let lastFetch = 0;

async function getWeatherAPI() {
  const now = Date.now();
  if (cache && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  const key = process.env.WEATHER_KEY;
  if (!key) {
    throw new Error("WEATHER_KEY is missing in .env");
  }

  // Dùng forecast 1 ngày cho Đồng Nai + AQI + Alerts
  const url =
    `https://api.weatherapi.com/v1/forecast.json` +
    `?key=${key}&q=Dong Nai&days=1&aqi=yes&alerts=yes`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data || data.error || !data.current) {
    console.log("WeatherAPI ERROR:", data);
    throw new Error("WeatherAPI failed");
  }

  const current = data.current;
  const condText = (current.condition?.text || "").toLowerCase();

  // Icon đơn giản
  let icon = "⛅";
  if (condText.includes("rain")) icon = "🌧";
  else if (condText.includes("storm")) icon = "⛈";
  else if (condText.includes("clear") || condText.includes("sun")) icon = "☀️";
  else if (condText.includes("cloud")) icon = "☁️";
  else if (condText.includes("fog") || condText.includes("mist"))
    icon = "🌫";

  // ==== Cảnh báo thông minh (ưu tiên Alert từ WeatherAPI, sau đó mới tự suy luận) ====
  let alert = "✔ Thời tiết ổn định.";

  const alerts = data.alerts?.alert;
  if (alerts && alerts.length > 0) {
    alert = "🚨 " + alerts[0].headline;
  } else {
    const uv = current.uv;
    const temp = current.temp_c;
    const wind = current.wind_kph;

    if (uv >= 11) {
      alert = "☠️ UV cực kỳ nguy hiểm – tránh ra ngoài nếu không cần thiết.";
    } else if (uv >= 8) {
      alert = "🔥 UV rất cao – hạn chế ra ngoài, che chắn kỹ và bôi kem chống nắng.";
    } else if (uv >= 6) {
      alert = "🌤 UV cao – nên bôi kem chống nắng nếu ra ngoài lâu.";
    } else if (condText.includes("rain")) {
      alert = "🌧 Có mưa – nhớ thu quần áo, kiểm tra cửa sổ.";
    } else if (temp >= 35) {
      alert = "🔥 Trời rất nóng – uống đủ nước, cân nhắc bật điều hòa.";
    } else if (wind >= 30) {
      alert = "💨 Gió mạnh – đóng cửa sổ, cố định đồ ngoài trời.";
    }
  }

  // ==== Series UV cho biểu đồ (8 giờ tới) ====
  const hours = data.forecast?.forecastday?.[0]?.hour || [];
  const nowEpoch = data.location?.localtime_epoch || Date.now() / 1000;

  const uvSeries = hours
    .filter(h => h.time_epoch >= nowEpoch)  // từ giờ hiện tại trở đi
    .slice(0, 8)                            // 8 mốc tiếp theo
    .map(h => ({
      time: h.time, // "2025-11-24 01:00"
      uv: h.uv
    }));

  cache = {
    temp: current.temp_c,
    humidity: current.humidity,
    wind: current.wind_kph,
    status: current.condition.text,
    icon,
    uv: current.uv,
    aqi: current.air_quality?.pm2_5 ?? null,
    alert,
    uvSeries
  };

  lastFetch = Date.now();
  return cache;
}

module.exports = { getWeatherAPI };
