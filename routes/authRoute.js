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

module.exports = route;