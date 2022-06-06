const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const blogRoute = require('./routes/blogRoute');
const adminRoute = require('./routes/adminRoute');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(blogRoute);
app.use(adminRoute);

app.listen(3000);



