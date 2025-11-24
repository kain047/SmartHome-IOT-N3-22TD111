const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'lhu-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const db = require('./config/database');
db.connect();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const sensorRouter = require('./routes/sensors');
const weatherRoutes = require("./routes/weather");

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/sensors', sensorRouter);
app.use('/history', sensorRouter);
app.use("/api/weather", weatherRoutes);



app.use((req, res) => {
  res.status(404).render('404', { title: 'Không tìm thấy trang' });
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
