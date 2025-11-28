const { Book, Author, Genre, Publisher } = require('../models');

class HomeController {
  static async index(req, res) {
    res.render('home', { user: req.session.user });
  }

  static async oldIndex(req, res) {
    const theme = req.query.theme || null;
    const where = theme ? { Theme: theme } : {};
    const books = await Book.findAll({ 
      where, 
      include: [Author, Genre, Publisher], 
      order: [['BookID','DESC']] 
    });
    res.render('index', { books, theme });
  }
}

module.exports = HomeController;

