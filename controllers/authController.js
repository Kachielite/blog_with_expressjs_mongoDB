const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) =>{
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        message: req.flash('error'),
    })
};

exports.postLogin = (req, res) => {
    User.findOne({username: req.body.username}).then(user =>{
        if(!user){
            req.flash('error', 'User can not be found.');
            return res.redirect('/login');
        }
        req.session.user = user; 
        return user;
    }).then(user =>{
        if(user){
            return bcrypt.compare(req.body.password, user.password)
        }
    }).then(doMatch =>{
        if(doMatch === false){
            req.flash('error', 'Incorrect password. Please check the password and try again')
            return res.redirect('/login'); 
        } else{
            return req.session.user;
        }
    }).then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        return req.session.save()
    }).then(results =>{
        if(!results){
            return res.redirect('/admin');
        }
    }).catch(err =>{
        console.log(err)
    })
};

exports.getRegistration = (req, res) =>{
    res.render('auth/register',{
        pageTitle: 'Registration',
        path: '/register',
        message: req.flash('error'),
    })
};

exports.postRegistration = (req, res) => {

    User.find({username: req.body.username}).then(user => {
        if(user){
            req.flash('error','Username exist. Please use a different username.');
            return res.redirect('/register')
            
        } else if (req.body.password !== req.body.confirmPassword){
            req.flash('error','Passwords do not match. Please check the passwords to ensure they match');
            return res.redirect('/register')
            
        }
        return bcrypt.hash(req.body.password, 12)
    }).then(hashPassword =>{
        const user = new User({
            username: req.body.username,
            password: hashPassword,
            postId: []
        })
        return user.save();
    }).then(results =>{
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