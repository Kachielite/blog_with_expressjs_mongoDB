const express = require('express');

const blogController = require('../controllers/blogController');

const route = express.Router();

route.get('/', blogController.getAllPosts);
route.get('/post/:title', blogController.getPost);
route.get('/author', blogController.getAuthor);

module.exports = route;