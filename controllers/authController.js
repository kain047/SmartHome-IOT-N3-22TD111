const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/login', {
    title: 'Đăng nhập',
    error: null,
    success: null
  });
};

exports.getRegisterPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/register', {
    title: 'Đăng ký',
    error: null
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/register', {
        title: 'Đăng ký',
        error: errors.array()[0].msg
      });
    }

    const { username, contact, password, fullName } = req.body;
    const email = contact

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Đăng ký',
        error: 'Tên đăng nhập đã tồn tại'
      });
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.render('auth/register', {
        title: 'Đăng ký',
        error: 'Email đã được sử dụng'
      });
    }

    await User.create({ username, email, password, fullName });

    res.render('auth/login', {
      title: 'Đăng nhập',
      error: null,
      success: 'Đăng ký thành công! Vui lòng đăng nhập.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', {
      title: 'Đăng ký',
      error: 'Có lỗi xảy ra. Vui lòng thử lại.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/login', {
        title: 'Đăng nhập',
        error: errors.array()[0].msg,
        success: null
      });
    }

    const { username, password } = req.body;
    const user = await User.findByUsername(username);

    if (!user) {
      return res.render('auth/login', {
        title: 'Đăng nhập',
        error: 'Tên đăng nhập hoặc mật khẩu không đúng',
        success: null
      });
    }

    const isValidPassword = await User.verifyPassword(password, user.Password);
    if (!isValidPassword) {
      return res.render('auth/login', {
        title: 'Đăng nhập',
        error: 'Tên đăng nhập hoặc mật khẩu không đúng',
        success: null
      });
    }

    req.session.user = {
      id: user.UserID,
      username: user.Username,
      email: user.Email,
      fullName: user.FullName,
      role: user.Role
    };

    console.log("SESSION SET:", req.session.user);


    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Đăng nhập',
      error: 'Có lỗi xảy ra. Vui lòng thử lại.',
      success: null
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
};