const { getPool, sql } = require('../config/database');

class Device {

  static async getAll() {
    const pool = getPool();
    const result = await pool.request()
      .query("SELECT * FROM Devices ORDER BY CreatedAt DESC");
    return result.recordset;
  }

  static async getAllByUser(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .query('SELECT * FROM Devices WHERE UserID = @UserID ORDER BY CreatedAt DESC');
    return result.recordset;
  }

  static async create(userId, name, deviceType) {
    const pool = getPool();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('Name', sql.NVarChar, name)
      .input('DeviceType', sql.Int, deviceType)
      .query(`
        INSERT INTO Devices (Name, UserID, DeviceType, CreatedAt)
        VALUES (@Name, @UserID, @DeviceType, GETDATE());
        SELECT SCOPE_IDENTITY() AS id;
      `);

    return result.recordset[0].id;
  }


  static async delete(userId, deviceId) {
    const pool = getPool();

    await pool.request()
      .input('DeviceID', sql.Int, deviceId)
      .input('UserID', sql.Int, userId)
      .query(`
        DELETE FROM Sensors WHERE DeviceID = @DeviceID;
        DELETE FROM Devices WHERE DeviceID = @DeviceID AND UserID = @UserID;
      `);
  }
}

module.exports = Device;
