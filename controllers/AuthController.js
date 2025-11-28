const { User } = require('../models');
const { Sequelize } = require('sequelize');
const { Op } = Sequelize;

class AuthController {
  static showLogin(req, res) {
    if (req.session.user) {
      return res.redirect('/profile');
    }
    res.render('login', { error: null });
  }

  static async login(req, res) {
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
  }

  static showRegister(req, res) {
    if (req.session.user) {
      return res.redirect('/profile');
    }
    res.render('register', { error: null });
  }

  static async register(req, res) {
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
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/');
    });
  }
}

module.exports = AuthController;

