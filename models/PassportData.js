const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PassportData = sequelize.define('PassportData', {
    PaspDanID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nomer: {
        type: DataTypes.STRING
    },
    Seriya: {
        type: DataTypes.STRING
    },
    Data_rojdeniya: {
        type: DataTypes.DATE
    }
    ,
    VladeletsID: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = PassportData;