const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { use } = require('../routes/adminRoute');

exports.getLogin = (req, res) =>{
    let errMessage = '';
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        message: errMessage
    })
};

exports.postLogin = (req, res) => {
    res.redirect('/admin')
};

exports.getRegistration = (req, res) =>{
    let errMessage = '';
    res.render('auth/register',{
        pageTitle: 'Registration',
        path: '/register',
        message: errMessage
    })
};

exports.postRegistration = (req, res) => {
    let errMessage = '';
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({username: username}).then(user => {
        if(user){
            errMessage = 'Username exist. Please use a different username.';
            res.render('auth/register',{
                pageTitle: 'Registration',
                path: '/register',
                message: errMessage
            })
            res.redirect('/register')
            return;
        } 
        if (password != confirmPassword){
            errMessage = 'Passwords do not match. Please check the passwords to ensure they match';
            res.render('auth/register',{
                pageTitle: 'Registration',
                path: '/register',
                message: errMessage
            })
            res.redirect('/register')
            return;
        }
        return bcrypt.hash(password, 12)
    }).then(hashPassword =>{
        const user = new User({
            username: username,
            password: hashPassword,
            postId: []
        })
        user.save();
        res.redirect('/login')
    }).catch(err =>{
        console.log(err)
    })


};