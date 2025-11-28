const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FinOperation = sequelize.define('FinOperation', {
    FinOperationID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Date: {
        type: DataTypes.DATE
    },
    Summa: {
        type: DataTypes.DECIMAL(10, 2)
    },
    Category: {
        type: DataTypes.STRING
    }
});

module.exports = FinOperation;