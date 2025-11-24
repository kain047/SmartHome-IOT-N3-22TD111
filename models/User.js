const { getPool, sql } = require('../config/database');
const bcrypt = require('bcrypt');

class User {

  /* ==========================
        TẠO TÀI KHOẢN
  ========================== */
  static async create(userData) {
    try {
      const pool = getPool();
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const result = await pool.request()
        .input('username', sql.NVarChar, userData.username)
        .input('email', sql.NVarChar, userData.email)
        .input('password', sql.NVarChar, hashedPassword) // ghi đúng cột Password
        .input('fullName', sql.NVarChar, userData.fullName)
        .input('role', sql.NVarChar, userData.role || 'user')
        .query(`
          INSERT INTO Users (Username, Email, Password, FullName, Role, CreatedAt)
          VALUES (@username, @email, @password, @fullName, @role, GETDATE());
          SELECT SCOPE_IDENTITY() AS UserID;
        `);

      return result.recordset[0].UserID;

    } catch (error) {
      console.error("SQL Error:", error);
      throw new Error('Lỗi khi tạo tài khoản: ' + error.message);
    }
  }

  /* ==========================
        TÌM USER THEO USERNAME
  ========================== */
  static async findByUsername(username) {
    const pool = getPool();
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query(`
        SELECT 
          UserID,
          Username,
          Email,
          Password,
          FullName,
          Role,
          CreatedAt
        FROM Users
        WHERE Username = @username
      `);

    return result.recordset[0];
  }

  /* ==========================
        TÌM USER THEO EMAIL
  ========================== */
  static async findByEmail(email) {
    const pool = getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT 
          UserID,
          Username,
          Email,
          Password,
          FullName,
          Role,
          CreatedAt
        FROM Users
        WHERE Email = @email
      `);

    return result.recordset[0];
  }

  /* ==========================
         LẤY TẤT CẢ USER
  ========================== */
  static async getAll() {
    const pool = getPool();
    const result = await pool.request()
      .query(`
        SELECT 
          UserID,
          Username,
          Email,
          FullName,
          Role,
          CreatedAt
        FROM Users
        ORDER BY CreatedAt DESC
      `);

    return result.recordset;
  }

  /* ==========================
         XOÁ USER
  ========================== */
  static async delete(userId) {
    const pool = getPool();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .query(`DELETE FROM Users WHERE UserID = @UserID`);
  }

  /* ==========================
         KIỂM TRA PASSWORD
  ========================== */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /* ==========================
        UPDATE ROLE
  ========================== */
  static async updateRole(userId, role) {
    const pool = getPool();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('Role', sql.NVarChar, role)
      .query(`UPDATE Users SET Role = @Role WHERE UserID = @UserID`);
  }

  /* ==========================
        UPDATE PASSWORD
  ========================== */
  static async updatePassword(userId, newPassword) {
    const pool = getPool();

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('Password', sql.NVarChar, hashed)
      .query(`UPDATE Users SET Password = @Password WHERE UserID = @UserID`);
  }
}

module.exports = User;
