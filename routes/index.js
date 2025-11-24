const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Trang chủ - LHU'
  });
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  res.render('dashboard', { title: 'Dashboard' });
});

router.get('/panel', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  res.render('panel', { title: 'Dashboard IoT' });
});


module.exports = router;