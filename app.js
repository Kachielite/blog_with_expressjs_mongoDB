const path = require('path');
const port = process.env.PORT || 3000;
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session)

const blogRoute = require('./routes/blogRoute');
const adminRoute = require('./routes/adminRoute');
const authRoute = require('./routes/authRoute');

const app = express();
const store = new MongoDbStore({
    uri : process.env.MONGO_URI,
    collection: 'session'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'my secret', resave: false, saveUninitialized: false, store: store}));

app.use(blogRoute);
app.use(adminRoute);
app.use(authRoute);


mongoose.connect(`${process.env.MONGO_URI}`).then(results => {
    app.listen(process.env.PORT || 3000, function(){
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
}).catch(err =>{
    console.log(err)
});


