const express = require('express');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/database');
const { Sequelize } = require('sequelize');
const { Op } = Sequelize;
const { Book, Author, Genre, Publisher, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } 
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

app.get('/', async (req, res) => {
  res.render('home', { user: req.session.user });
});

app.get('/old-index', async (req, res) => {
  const theme = req.query.theme || null;
  const where = theme ? { Theme: theme } : {};
  const books = await Book.findAll({ where, include: [Author, Genre, Publisher], order: [['BookID','DESC']] });
  res.render('index', { books, theme });
});

app.get('/catalog', async (req, res) => {
  const { theme, author, genre, added } = req.query;
  const where = {};
  
  if (theme) where.Theme = theme;
  
  const includeOptions = [];
  
  if (author) {
    includeOptions.push({
      model: Author,
      where: { Name: author },
      required: true
    });
  } else {
    includeOptions.push(Author);
  }
  
  if (genre) {
    includeOptions.push({
      model: Genre,
      where: { Name: genre },
      required: true
    });
  } else {
    includeOptions.push(Genre);
  }
  
  includeOptions.push(Publisher);
  
  const books = await Book.findAll({
    where,
    include: includeOptions,
    order: [['BookID', 'DESC']]
  });
  
  res.render('catalog', { books, theme, author, genre, added, user: req.session.user });
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { login, password } = req.body;
  
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { Email: login },
          { Username: login }
        ]
      }
    });
    
    if (!user) {
      return res.render('login', { error: 'Неверный email/username или пароль' });
    }
    
    const isValidPassword = await user.checkPassword(password);
    
    if (!isValidPassword) {
      return res.render('login', { error: 'Неверный email/username или пароль' });
    }
    
    req.session.user = {
      UserID: user.UserID,
      Username: user.Username,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Phone: user.Phone
    };
    
    res.redirect('/profile');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Ошибка при входе. Попробуйте позже.' });
  }
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName, phone } = req.body;
  
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { Email: email },
          { Username: username }
        ]
      }
    });
    
    if (existingUser) {
      return res.render('register', { error: 'Пользователь с таким email или username уже существует' });
    }
    
    const user = await User.create({
      Username: username,
      Email: email,
      Password: password,
      FirstName: firstName || null,
      LastName: lastName || null,
      Phone: phone || null
    });
    
    req.session.user = {
      UserID: user.UserID,
      Username: user.Username,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Phone: user.Phone
    };
    
    res.redirect('/profile');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Ошибка при регистрации. Попробуйте позже.' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

app.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  try {
    const user = await User.findByPk(req.session.user.UserID);
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }
    
    res.render('profile', { user: user });
  } catch (error) {
    console.error('Profile error:', error);
    res.redirect('/');
  }
});

app.get('/cart', async (req, res) => {
  const cart = req.session.cart || [];
  const cartBooks = [];
  for (const bookId of cart) {
    const book = await Book.findByPk(bookId, {
      include: [Author, Genre, Publisher]
    });
    if (book) {
      cartBooks.push(book);
    }
  }
  
  res.render('cart', { cart: cartBooks, user: req.session.user });
});
app.post('/cart/add', async (req, res) => {
  const { bookId } = req.body;
  
  if (!req.session.cart) {
    req.session.cart = [];
  }
  
  if (!req.session.cart.includes(parseInt(bookId))) {
    req.session.cart.push(parseInt(bookId));
  }
  
  res.redirect('/cart');
});

app.post('/cart/remove', (req, res) => {
  const { index } = req.body;
  const idx = parseInt(index);
  
  if (req.session.cart && idx >= 0 && idx < req.session.cart.length) {
    req.session.cart.splice(idx, 1);
  }
  
  res.redirect('/cart');
});

app.get('/add-book', async (req, res) => {
  const { authorAdded, genreAdded, publisherAdded } = req.query;
  const authors = await Author.findAll();
  const genres = await Genre.findAll();
  const publishers = await Publisher.findAll();
  res.render('add-book', { 
    authors, 
    genres, 
    publishers, 
    user: req.session.user,
    authorAdded,
    genreAdded,
    publisherAdded
  });
});

app.post('/add-book', async (req, res) => {
  try {
    const { title, theme, authorId, genreId, publisherId } = req.body;
    
    if (!title || title.trim() === '') {
      const authors = await Author.findAll();
      const genres = await Genre.findAll();
      const publishers = await Publisher.findAll();
      return res.render('add-book', { 
        authors, 
        genres, 
        publishers, 
        error: 'Название книги обязательно для заполнения',
        user: req.session.user 
      });
    }
    
    await Book.create({
      Title: title.trim(),
      Theme: theme && theme.trim() ? theme.trim() : null,
      AuthorId: authorId && authorId !== '' ? parseInt(authorId) : null,
      GenreId: genreId && genreId !== '' ? parseInt(genreId) : null,
      PublisherId: publisherId && publisherId !== '' ? parseInt(publisherId) : null
    });
    
    res.redirect('/catalog?added=success');
  } catch (error) {
    console.error('Add book error:', error);
    const authors = await Author.findAll();
    const genres = await Genre.findAll();
    const publishers = await Publisher.findAll();
    res.render('add-book', { 
      authors, 
      genres, 
      publishers, 
      error: 'Ошибка при добавлении книги. Попробуйте позже.',
      user: req.session.user 
    });
  }
});

app.get('/add-author', (req, res) => { 
  res.render('add-author', { user: req.session.user }); 
});
app.post('/add-author', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.render('add-author', { 
        error: 'Имя автора обязательно для заполнения',
        user: req.session.user 
      });
    }
    await Author.create({ Name: name.trim() });
    res.redirect('/add-book?authorAdded=success');
  } catch (error) {
    console.error('Add author error:', error);
    res.render('add-author', { 
      error: 'Ошибка при добавлении автора. Возможно, автор с таким именем уже существует.',
      user: req.session.user 
    });
  }
});

app.get('/add-genre', (req, res) => { 
  res.render('add-genre', { user: req.session.user }); 
});
app.post('/add-genre', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.render('add-genre', { 
        error: 'Название жанра обязательно для заполнения',
        user: req.session.user 
      });
    }
    await Genre.create({ Name: name.trim() });
    res.redirect('/add-book?genreAdded=success');
  } catch (error) {
    console.error('Add genre error:', error);
    res.render('add-genre', { 
      error: 'Ошибка при добавлении жанра. Возможно, жанр с таким названием уже существует.',
      user: req.session.user 
    });
  }
});

app.get('/add-publisher', (req, res) => { 
  res.render('add-publisher', { user: req.session.user }); 
});
app.post('/add-publisher', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.render('add-publisher', { 
        error: 'Название издательства обязательно для заполнения',
        user: req.session.user 
      });
    }
    await Publisher.create({ Name: name.trim() });
    res.redirect('/add-book?publisherAdded=success');
  } catch (error) {
    console.error('Add publisher error:', error);
    res.render('add-publisher', { 
      error: 'Ошибка при добавлении издательства. Возможно, издательство с таким названием уже существует.',
      user: req.session.user 
    });
  }
});

// 404 обработчик
app.use((req, res) => {
  res.status(404).render('404', { user: req.session.user });
});

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
  });
}).catch(err => {
  console.error('DB sync error', err);
});
