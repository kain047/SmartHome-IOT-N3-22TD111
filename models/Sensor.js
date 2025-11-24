const { getPool, sql } = require('../config/database');

class Sensor {

  static async getAll() {
    const pool = getPool();
    const result = await pool.request()
      .query(`SELECT * FROM Sensors ORDER BY SensorID ASC`);
    return result.recordset;
  }

  static async create(deviceId, type, unit) {
    const pool = getPool();
    await pool.request()
      .input('DeviceID', sql.Int, deviceId)
      .input('Type', sql.NVarChar, type)
      .input('Unit', sql.NVarChar, unit)
      .query(`
        INSERT INTO Sensors (DeviceID, Type, Unit)
        VALUES (@DeviceID, @Type, @Unit)
      `);
  }
}

module.exports = Sensor;
