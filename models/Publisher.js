const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publisher = sequelize.define('Publisher', {
  PublisherID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Name: { type: DataTypes.STRING }
});

module.exports = Publisher;