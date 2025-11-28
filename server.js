const express = require('express');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/database');
const routes = require('./routes');
const { sessionMiddleware, cartMiddleware } = require('./middleware/session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Custom middleware
app.use(sessionMiddleware);
app.use(cartMiddleware);

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { user: req.session.user });
});

// Database sync and server start
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  GET  / - Главная страница');
    console.log('  GET  /catalog - Каталог книг');
    console.log('  GET  /login - Авторизация');
    console.log('  GET  /register - Регистрация');
    console.log('  GET  /cart - Корзина');
    console.log('  GET  /profile - Профиль');
    console.log('  GET  /add-book - Добавить книгу');
  });
}).catch(err => {
  console.error('DB sync error', err);
});
