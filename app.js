const path = require('path');
const port = process.env.PORT || 3000;
require('dotenv').config()

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



mongoose.connect(`mongodb+srv://kaci:${process.env.DB_CRED}@blog.4p3uelb.mongodb.net/blog?retryWrites=true&w=majority`).then(results => {
    User.findOne().then(user=>{
        if (!user){
            const user = new User({name: 'Kachi', email:'kachi@test.com',postId:[]})
            user.save();
        } else{
            return;
        }
    });
    app.listen(process.env.PORT || 3000, function(){
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
}).catch(err =>{
    console.log(err)
});


