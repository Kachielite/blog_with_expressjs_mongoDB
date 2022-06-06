const express = require('express');

const adminController = require('../controllers/adminController');

const route = express.Router();

route.get('/admin', adminController.getAdminPage);
route.post('/admin/posts', adminController.login);
route.get('/admin/blog', adminController.getAllPost)
route.get('/admin/add_post', adminController.addNewPost);


module.exports = route;