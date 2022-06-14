const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Blogs = sequelize.define('blog',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    imageURL:{
        type: DataTypes.STRING,
        allowNull: false
    },
    article:{
        type: DataTypes.TEXT,
        allowNull: false
    },    
})


module.exports = Blogs;