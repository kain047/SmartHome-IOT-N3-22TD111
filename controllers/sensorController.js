// controllers/sensorController.js
const SensorData = require('../models/SensorData');
const Sensor = require('../models/Sensor');
const Device = require('../models/Device');

// ================== DATA REALTIME ==================
exports.getAllData = async (req, res) => {
  try {
    const data = await SensorData.getAll();
    res.json(data);
  } catch (err) {
    console.error('Lỗi getAllData:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addData = async (req, res) => {
  try {
    const { sensorId, value } = req.body;
    if (!sensorId || typeof value === 'undefined') {
      return res.status(400).json({ error: 'Thiếu SensorID hoặc Value' });
    }

    await SensorData.insert(sensorId, value);
    res.json({ message: 'Dữ liệu đã được thêm!' });
  } catch (err) {
    console.error('Lỗi addData:', err);
    res.status(500).json({ error: err.message });
  }
};

// ================== SENSORS & DEVICES ==================
exports.getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.getAll();
    res.json(sensors);
  } catch (err) {
    console.error('Lỗi getSensors:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.getAll();
    res.json(devices);
  } catch (err) {
    console.error('Lỗi getDevices:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDevicesByUser = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Chưa đăng nhập' });
    }
    const userId = req.session.user.id;
    const devices = await Device.getAllByUser(userId);
    res.json(devices);
  } catch (err) {
    console.error('Lỗi getDevicesByUser:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addDevice = async (req, res) => {
  try {
    if (!req.session.user)
      return res.status(401).json({ error: 'Chưa đăng nhập' });

    const { name, type } = req.body;
    const userId = req.session.user.id;

    if (!name || !type) {
      return res.status(400).json({ error: 'Thiếu tên hoặc loại thiết bị' });
    }

    await Device.create(userId, name, type);
    res.json({ message: 'Thiết bị đã được thêm!' });
  } catch (err) {
    console.error('Lỗi addDevice:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    if (!req.session.user)
      return res.status(401).json({ error: 'Chưa đăng nhập' });

    const userId = req.session.user.id;
    const { deviceId } = req.params;

    await Device.delete(userId, deviceId);

    res.json({ message: 'Đã xóa thiết bị thành công!' });
  } catch (err) {
    console.error('❌ Lỗi khi xóa thiết bị:', err);
    res.status(500).json({ error: err.message });
  }
};

// ================== HISTORY PAGE ==================
exports.historyPage = (req, res) => {
  // Trang giao diện lịch sử (EJS), mount dưới /api/sensors/history
  res.render('history', {
    title: 'Lịch sử dữ liệu cảm biến',
    user: req.session.user
  });
};

// ================== API HISTORY (JSON) ==================
exports.getHistoryData = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 20,
      type = '',
      device = '',
      from = '',
      to = ''
    } = req.query;

    const result = await SensorData.getHistory({
      page: Number(page),
      pageSize: Number(pageSize),
      type: type || null,
      device: device || null,
      from: from || null,
      to: to || null
    });

    res.json({
      rows: result.rows,
      total: result.total,
      page: Number(page),
      pageSize: Number(pageSize)
    });
  } catch (err) {
    console.error('Lỗi lấy lịch sử:', err);
    res.status(500).json({ error: err.message });
  }
};

// ================== EXPORT CSV ==================
exports.exportHistoryCsv = async (req, res) => {
  try {
    const {
      type = '',
      device = '',
      from = '',
      to = ''
    } = req.query;

    const result = await SensorData.getHistory({
      page: 1,
      pageSize: 1000000, // lấy nhiều cho export
      type: type || null,
      device: device || null,
      from: from || null,
      to: to || null
    });

    const rows = result.rows;

    let csv = 'Timestamp,Device,Type,Value,Unit\n';
    rows.forEach(r => {
      const ts = r.Timestamp instanceof Date
        ? r.Timestamp.toISOString()
        : new Date(r.Timestamp).toISOString();

      csv += `"${ts}","${r.Device}","${r.Type}",${r.Value},"${r.Unit || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="history.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Lỗi export CSV:', err);
    res.status(500).send('Không thể export CSV');
  }
};
