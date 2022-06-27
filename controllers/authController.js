const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
let errMessage = '';

exports.getLogin = (req, res) =>{
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        message: errMessage,
        isAuth: req.session.isLoggedIn
    })
};

exports.postLogin = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}).then(user =>{
        if(user && bcrypt.compare(req.body.password, user.password)){
            req.session.user = user
            req.session.isLoggedIn = true;
            errMessage ='';
            return req.session.save(err =>{
                console.log(err)
                res.redirect('/admin')
            })
        } 

        errMessage = 'Bad Credentials!!'
        res.redirect('/login')
        
    }).catch(err =>{
        console.log(err)
    })
};

exports.getRegistration = (req, res) =>{
    res.render('auth/register',{
        pageTitle: 'Registration',
        path: '/register',
        message: errMessage,
        isAuth: req.session.isLoggedIn
    })
};

exports.postRegistration = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({username: username}).then(user => {
        if(user){
            errMessage = 'Username exist. Please use a different username.';
            res.redirect('/register')
            return;
        } else if (password !== confirmPassword){
            errMessage = 'Passwords do not match. Please check the passwords to ensure they match';
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
        return user.save();
    }).then(results =>{
        errMessage ='';
        res.redirect('/login')
    }).catch(err =>{
        console.log(err)
    })

};

exports.postLogout = (req, res) =>{
    req.session.destroy(err =>{
        console.log(err);
        res.redirect('/login')
    })
};