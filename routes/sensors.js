// routes/sensors.js
const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// ================== API REALTIME & CRUD ==================
router.get('/data', sensorController.getAllData);
router.post('/data', sensorController.addData);

router.get('/devices', sensorController.getDevices);
router.get('/list', sensorController.getSensors);

router.get('/user-devices', sensorController.getDevicesByUser);
router.post('/add-device', sensorController.addDevice);
router.delete('/delete-device/:deviceId', sensorController.deleteDevice);

// ================== HISTORY VIEW + API ==================

// Trang giao diện lịch sử → /api/sensors/history
router.get('/history', sensorController.historyPage);

// API dữ liệu history (JSON) → /api/sensors/api/history
router.get('/api/history', sensorController.getHistoryData);

// Export CSV → /api/sensors/api/history/export
router.get('/api/history/export', sensorController.exportHistoryCsv);

module.exports = router;
