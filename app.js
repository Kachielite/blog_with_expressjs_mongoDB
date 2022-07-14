const path = require('path');
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const blogRoute = require('./routes/blogRoute');
const adminRoute = require('./routes/adminRoute');
const authRoute = require('./routes/authRoute');
const errorController = require('./controllers/errorController');


const port = process.env.PORT || 3000;
const app = express();

//Session Store
const store = new MongoDbStore({
    uri : process.env.MONGO_URI,
    collection: 'session'
})
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

//Session, CSRF Protection
app.use(session({secret:'my secret', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection)
app.use(flash())
app.use((req,res,next) =>{
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(blogRoute);
app.use(adminRoute);
app.use(authRoute);

app.get('/500', errorController.get500);
app.use(errorController.get404)

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    res.redirect('/500');
  });


mongoose.connect(`${process.env.MONGO_URI}`).then(results => {
    app.listen(port, function(){
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
}).catch(err =>{
    console.log(err)
});


