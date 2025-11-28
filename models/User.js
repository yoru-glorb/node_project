const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  UserID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Username: { type: DataTypes.STRING, allowNull: false, unique: true },
  Email: { type: DataTypes.STRING, allowNull: false, unique: true },
  Password: { type: DataTypes.STRING, allowNull: false },
  FirstName: { type: DataTypes.STRING },
  LastName: { type: DataTypes.STRING },
  Phone: { type: DataTypes.STRING }
});
User.beforeCreate(async (user) => {
  if (user.Password) {
    user.Password = await bcrypt.hash(user.Password, 10);
  }
});
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.Password);
};

module.exports = User;
