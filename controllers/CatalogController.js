const { Book, Author, Genre, Publisher } = require('../models');

class CatalogController {
  static async index(req, res) {
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
  }
}

module.exports = CatalogController;

