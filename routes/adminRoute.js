const express = require('express');
const adminController = require('../controllers/adminController');

const route = express.Router();

//GET Admin login
route.get('/admin', adminController.getAdminLoginPage);

//GET Admin Dashboard
route.get('/admin/blog', adminController.getAdminDashboard);

//GET Edit Page
route.get('/admin/edit/:postId', adminController.editPost);

//POST update
route.post('/admin/update/:postId', adminController.postUpdate);

//GET New Post Page
route.get('/admin/add_post', adminController.getEditPostPage);

//POST new post
route.post('/admin/post_blog', adminController.postNewBlogPost);

//Delete post
route.post('/admin/delete/:postId', adminController.deletePost);

module.exports = route;
