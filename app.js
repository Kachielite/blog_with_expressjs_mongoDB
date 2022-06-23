const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const blogRoute = require('./routes/blogRoute');
const adminRoute = require('./routes/adminRoute');

const User = require('./models/userModel')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(blogRoute);
app.use(adminRoute);



mongoose.connect('mongodb+srv://kaci:d6l33EiTqHxc3q1g@blog.4p3uelb.mongodb.net/blog?retryWrites=true&w=majority').then(results => {
    User.findOne().then(user=>{
        if (!user){
            const user = new User({name: 'Kachi', email:'kachi@test.com',postId:[]})
            user.save();
        } else{
            return;
        }
    });
    app.listen('3000')
}).catch(err =>{
    console.log(err)
});


