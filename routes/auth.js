const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 }).withMessage('Tên đăng nhập phải có ít nhất 3 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'),
body('contact')
  .trim()
  .custom(value => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,11}$/;
    if (emailRegex.test(value) || phoneRegex.test(value)) return true;
    throw new Error('Email hoặc Số điện thoại không hợp lệ');
  }),
  body('password')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password).withMessage('Mật khẩu xác nhận không khớp'),
  body('fullName')
    .trim()
    .notEmpty().withMessage('Họ và tên không được để trống')
];

const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Tên đăng nhập không được để trống'),
  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
];

router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/logout', authController.logout);

module.exports = router;