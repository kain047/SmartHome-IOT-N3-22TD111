exports.requireSuperAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.Role !== 'super') {
    return res.status(403).send("🚫 Bạn không có quyền truy cập Super Admin");
  }
  next();
};
