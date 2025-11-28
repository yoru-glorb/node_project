const { User } = require('../models');

class ProfileController {
  static async index(req, res) {
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
  }
}

module.exports = ProfileController;

