// controllers/weatherController.js
const { getWeatherAPI } = require("../services/weatherService");

exports.getTodayWeather = async (req, res) => {
  try {
    const data = await getWeatherAPI();
    res.json(data);
  } catch (err) {
    console.error("Weather controller error:", err.message);
    res.status(500).json({ error: "Weather fetch error" });
  }
};
