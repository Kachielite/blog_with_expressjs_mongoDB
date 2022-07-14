require('dotenv').config()
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const request = require('request');
const {validationResult} = require('express-validator/check')

const User = require('../models/userModel');
const { error } = require('console');

let transport = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


exports.getLogin = (req, res) =>{
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        message: req.flash('error'),
        info: req.flash('info'),
    })
};

exports.postLogin = (req, res, next) => {
    

    User.findOne({$or:[{username: req.body.username}, {email: req.body.username}]}).then(user =>{
        if(!user){
            req.flash('error', 'User/Email can not be found.');
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
};

exports.getRegistration = (req, res) =>{
    res.render('auth/register',{
        pageTitle: 'Registration',
        path: '/register',
        message: req.flash('error'),
        info:  req.flash('info'),
        oldData: req.flash('oldData')
    })
};

exports.postRegistration = (req, res, next) => {


    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
        req.flash('error','Failed captcha verification. Please ensure you check the reCaptcha');
        return res.redirect('/register')
    }
    
    const secretKey = "6LfQN7IgAAAAAMFnKO_20No6hwU55TSlGaAy0NgI";
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL,function(error,response,) {
        if(error){
            req.flash('error','Failed captcha verification');
            req.flash('oldData',)
            return res.redirect('/register');
        } 
    })

    const error = validationResult(req);
    if(!error.isEmpty()){
        req.flash('error', error.array())
        req.flash('oldData', {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
        return res.status(422).redirect('/register')
    }
    
    bcrypt.hash(req.body.password, 12).then(hashPassword =>{
        const user = new User({
            username: (req.body.username).toLowerCase(),
            email: req.body.email,
            password: hashPassword,
            postId: []
        })
        return user.save();
    }).then(results =>{
        req.flash('info', 'Registration Successful. Please login to gain access')
        res.redirect('/login')
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })

};

exports.postLogout = (req, res) =>{
    req.session.destroy(err =>{
        console.log(err);
        res.redirect('/login')
    })
};

exports.getForgetPasswordPage = (req, res) => {
    res.render('auth/forget',{
        pageTitle: 'Reset Password',
        path: '/forget',
        message: req.flash('error'),
        info:  req.flash('info')
    })
}

exports.forgetPassword = (req, res, next) => {

    let token 

    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
        req.flash('error','Failed captcha verification. Please ensure you check the reCaptcha');
        return res.redirect('/forget')
    }
    
    const secretKey = "6LfQN7IgAAAAAMFnKO_20No6hwU55TSlGaAy0NgI";
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL,function(error,response,) {
        if(error){
            req.flash('error','Failed captcha verification');
            return res.redirect('/register');
        } 
    })
    crypto.randomBytes(32, (err, buffer) =>{
        if(err){
            console.log(err);
            req.flash('error', err)
            return res.redirect('/forget')
        }
        token = buffer.toString('hex')
    })

    User.findOne({email: req.body.email}).then(user =>{
        if(!user){
            req.flash('error','Email not found')
            return res.redirect('/forget')
        }
        user.resetToken = token,
        user.resetExpiration = Date.now()+ 3600000;
        return user.save()
    }).then(results => {
        transport.sendMail({
            from: 'admin@twiikle.com',
            to: req.body.email,
            subject: 'Password Reset',
            html: `
            <h1>Kachi Blog</h1>
            <p>Click this <a href='http://kachi28.herokuapp.com/reset/${token}'>link</a> to reset your password</p>
            `
        })
    }).then(results => {
        req.flash('info', 'A password reset link has been sent to your email. Kindly check your inbox or spam folder.')
        return res.redirect('/forget')
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })

}

exports.getResetPassword = (req, res, next) => {
    let token = req.params.token

    User.findOne({resetToken: token, resetExpiration: {$gt: Date.now()}}).then(user =>{
        if(!user){
            req.flash('error', 'Invalid Password link. Kindly try resetting the password again');
            return res.redirect('/forget');
        }
        res.render('auth/reset',{
            pageTitle: 'Reset',
            path:'/reset',
            message: req.flash('error'),
            userId: user._id,
            token: token
        })
    })
}

exports.resetPassword = (req, res) => {
    let token = req.body.token
    let userId = req.body.userId


    User.findById(userId).then(user =>{
        if(!user){
            req.flash('error', 'Invalid Password link, Kindly try resetting the password again');
            return res.redirect('/forget');
        }
        if(user.resetToken !== token){
            req.flash('error', 'Invalid reset token, Kindly try resetting the password again');
            return res.redirect('/forget');            
        }

        if(req.body.password !== req.body.confirmPassword){
            req.flash('error', 'Passwords do not match. Please check the passwords and try again');
            return res.redirect(`/reset/${user.resetToken}`);
        }

        req.user = user;
        return bcrypt.hash(req.body.password, 12)
    }).then(hashPassword =>{
        req.user.password = hashPassword
        req.user.resetToken = undefined;
        req.user.resetExpiration = undefined;
        return req.user.save()

    }).then(results =>{
            req.flash('info','Password reset successful. Please login to gain access to your dashboard')
            return res.redirect('/login')
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
}