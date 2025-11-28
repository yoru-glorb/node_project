const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Family = sequelize.define('Family', {
    SemyaID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    DoxodRasxodID: {
        type: DataTypes.INTEGER
    },
    PortfolioID: {
        type: DataTypes.INTEGER
    }
});

module.exports = Family;