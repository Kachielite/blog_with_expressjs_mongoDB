const express = require('express');

const blogController = require('../controllers/blogController');

const route = express.Router();

//GET Blog homepage
route.get('/', blogController.getHome);

//GET Post details
route.get('/post/:postId', blogController.getPostDetails);

//GET Author details
route.get('/author/:authorId', blogController.getAuthorDetails)

module.exports = route;