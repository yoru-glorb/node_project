const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  BookID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Title: { type: DataTypes.STRING },
  Theme: { type: DataTypes.STRING }
});

module.exports = Book;