const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Users = sequelize.define('users',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    first_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false

    }
})

module.exports = Users;
