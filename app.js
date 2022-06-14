const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/db')

const blogRoute = require('./routes/blogRoute');
const adminRoute = require('./routes/adminRoute');
const Blogs = require('./models/blogModel');
const Users = require('./models/userModel')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(blogRoute);
app.use(adminRoute);

Blogs.belongsTo(Users, {constraints: true, onDelete:'CASCADE'});
Users.hasMany(Blogs)

sequelize.sync().then(results=>{

    app.listen(process.env.PORT || 3000, function () {
        console.log('Node app is running')});

});

