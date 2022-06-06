const express = require('express');

const adminController = require('../controllers/adminController');

const route = express.Router();

route.get('/admin', adminController.getAllPosts);
route.get('/admin/add_post', adminController.addNewPost);


module.exports = route;