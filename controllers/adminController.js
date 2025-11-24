const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.userList = async (req, res) => {
  const users = await User.getAll();
  res.render('admin_users', {
    title: "Quản lý người dùng",
    user: req.session.user,
    users
  });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  await User.delete(id);
  res.json({ success: true });
};

exports.setRole = async (req, res) => {
  const { userId, role } = req.body;
  await User.updateRole(userId, role);
  res.json({ success: true });
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const newPassword = "123456";   // hoặc random mật khẩu

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.updatePassword(id, hashed);

  res.json({ success: true, newPassword });
};
