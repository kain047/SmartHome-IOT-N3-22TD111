// routes/weather.js
const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// GET /api/weather/today
router.get("/today", weatherController.getTodayWeather);

module.exports = router;
