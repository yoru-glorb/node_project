const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vladeletc = sequelize.define('Vladeletc', {
    VladeletsID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Imya: {
        type: DataTypes.STRING
    },
    Otchestvo: {
        type: DataTypes.STRING
    }
});

module.exports = Vladeletc;