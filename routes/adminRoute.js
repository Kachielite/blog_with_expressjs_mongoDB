const express = require('express');

const adminController = require('../controllers/adminController');

const route = express.Router();

// GET 
route.get('/admin', adminController.getAdminPage);
route.get('/admin/blog', adminController.getAllPost)
route.get('/admin/add_post', adminController.addNewPost);
route.get('/admin/edit/:id', adminController.editPost);

//POST
route.post('/admin/posts', adminController.login);
route.post('/admin/post_blog', adminController.postNewPost);
route.post('/admin/update/:id', adminController.postUpdate);
route.post('/admin/delete/:id', adminController.deletePost);


module.exports = route;