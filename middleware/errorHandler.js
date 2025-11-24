module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    title: 'Lỗi',
    message: err.message || 'Đã xảy ra lỗi',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};