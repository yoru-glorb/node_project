const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BankDetails = sequelize.define('BankDetails', {
    BankDannieID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Bank: {
        type: DataTypes.STRING
    },
    Valuta: {
        type: DataTypes.STRING
    },
    VladeletsID: {
        type: DataTypes.INTEGER
    }
});

module.exports = BankDetails;