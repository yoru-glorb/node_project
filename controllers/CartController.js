const { Book, Author, Genre, Publisher } = require('../models');

class CartController {
  static async index(req, res) {
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
  }

  static async add(req, res) {
    const { bookId } = req.body;
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    if (!req.session.cart.includes(parseInt(bookId))) {
      req.session.cart.push(parseInt(bookId));
    }
    
    res.redirect('/cart');
  }

  static remove(req, res) {
    const { index } = req.body;
    const idx = parseInt(index);
    
    if (req.session.cart && idx >= 0 && idx < req.session.cart.length) {
      req.session.cart.splice(idx, 1);
    }
    
    res.redirect('/cart');
  }
}

module.exports = CartController;

