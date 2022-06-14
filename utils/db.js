const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize('blog', 'blog', `${process.env.DB_CRED}`, {
    host: '159.223.222.229',
    dialect: 'mysql'
  });

module.exports = sequelize;


