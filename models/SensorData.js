// models/SensorData.js
const { getPool, sql } = require('../config/database');

class SensorData {
  // Lấy toàn bộ dữ liệu (không filter, dùng cho realtime dashboard)
  static async getAll() {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT d.Name AS Device, s.Type, s.Unit, sd.Value, sd.Timestamp
      FROM SensorData sd
      JOIN Sensors s ON sd.SensorID = s.SensorID
      JOIN Devices d ON s.DeviceID = d.DeviceID
      ORDER BY sd.Timestamp DESC
    `);
    return result.recordset;
  }

  // Thêm bản ghi mới
  static async insert(sensorId, value) {
    const pool = getPool();
    await pool.request()
      .input('SensorID', sql.Int, sensorId)
      .input('Value', sql.Float, value)
      .query('INSERT INTO SensorData (SensorID, Value) VALUES (@SensorID, @Value)');
  }

  // Lịch sử dữ liệu + filter + phân trang
  static async getHistory({ page = 1, pageSize = 20, type, device, from, to }) {
    const pool = getPool();
    const offset = (page - 1) * pageSize;

    let where = '1=1';
    const request = pool.request();

    if (type) {
      where += ' AND s.Type = @Type';
      request.input('Type', sql.NVarChar, type);
    }
    if (device) {
      where += ' AND d.Name = @Device';
      request.input('Device', sql.NVarChar, device);
    }
    if (from) {
      where += ' AND sd.Timestamp >= @From';
      request.input('From', sql.DateTime, new Date(from));
    }
    if (to) {
      where += ' AND sd.Timestamp <= @To';
      request.input('To', sql.DateTime, new Date(to));
    }

    const dataQuery = `
      SELECT d.Name AS Device, s.Type, s.Unit, sd.Value, sd.Timestamp
      FROM SensorData sd
      JOIN Sensors s ON sd.SensorID = s.SensorID
      JOIN Devices d ON s.DeviceID = d.DeviceID
      WHERE ${where}
      ORDER BY sd.Timestamp DESC
      OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
    `;

    const countQuery = `
      SELECT COUNT(*) AS Total
      FROM SensorData sd
      JOIN Sensors s ON sd.SensorID = s.SensorID
      JOIN Devices d ON s.DeviceID = d.DeviceID
      WHERE ${where}
    `;

    request.input('Offset', sql.Int, offset);
    request.input('PageSize', sql.Int, pageSize);

    const [dataResult, countResult] = await Promise.all([
      request.query(dataQuery),
      pool.request().query(countQuery)
    ]);

    return {
      rows: dataResult.recordset,
      total: countResult.recordset[0].Total
    };
  }
}

module.exports = SensorData;
