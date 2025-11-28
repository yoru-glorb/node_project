const { Book, Author, Genre, Publisher } = require('../models');

class BookController {
  static async showAddBook(req, res) {
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
  }

  static async addBook(req, res) {
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
  }

  static showAddAuthor(req, res) {
    res.render('add-author', { user: req.session.user });
  }

  static async addAuthor(req, res) {
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
  }

  static showAddGenre(req, res) {
    res.render('add-genre', { user: req.session.user });
  }

  static async addGenre(req, res) {
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
  }

  static showAddPublisher(req, res) {
    res.render('add-publisher', { user: req.session.user });
  }

  static async addPublisher(req, res) {
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
  }
}

module.exports = BookController;

