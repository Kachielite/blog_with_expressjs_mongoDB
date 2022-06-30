const express = require('express');

const authController = require('../controllers/authController');

const route = express.Router();

//GET Login Page 
route.get('/login', authController.getLogin);

//POST log in
route.post('/auth/login', authController.postLogin);

//GET Register Page
route.get('/register', authController.getRegistration);

//POST Registration
route.post('/auth/register', authController.postRegistration);

//POST LOGOUT
route.post('/logout', authController.postLogout);

//GET Forget password page
route.get('/forget', authController.getForgetPasswordPage)

//POST send password reset link
route.post('/auth/forget', authController.forgetPassword);

//Get reset password page
route.get('/reset/:token', authController.getResetPassword);

//POST reset password
route.post('/auth/reset', authController.resetPassword)



module.exports = route;