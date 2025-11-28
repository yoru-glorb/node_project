const sessionMiddleware = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

const cartMiddleware = (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
};

module.exports = {
  sessionMiddleware,
  cartMiddleware
};

