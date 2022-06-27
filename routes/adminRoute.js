const express = require('express');
const adminController = require('../controllers/adminController');
const isAuth = require('../middleware/isAuth')

const route = express.Router();

//GET Admin Dashboard
route.get('/admin', isAuth, adminController.getAdminDashboard);

//GET Edit Page
route.get('/admin/edit/:postId', isAuth, adminController.editPost);

//POST update
route.post('/admin/update/:postId',isAuth, adminController.postUpdate);

//GET New Post Page
route.get('/admin/add_post', isAuth, adminController.getEditPostPage);

//POST new post
route.post('/admin/post_blog',isAuth, adminController.postNewBlogPost);

//Delete post
route.post('/admin/delete/:postId', isAuth, adminController.deletePost);

module.exports = route;
