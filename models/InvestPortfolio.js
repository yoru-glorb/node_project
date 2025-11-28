const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvestPortfolio = sequelize.define('InvestPortfolio', {
    InvestPortfolioID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nazvanie: {
        type: DataTypes.STRING
    },
    KolichestvoAkciy: {
        type: DataTypes.INTEGER
    },
    Stoimost: {
        type: DataTypes.DECIMAL(10, 2)
    }
});

module.exports = InvestPortfolio;