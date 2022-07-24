require('dotenv').config();
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const {validationResult} = require('express-validator/check');
const deleteFile = require('../utils/deleteFile');
const cloudinary = require('cloudinary').v2;

//Cloudinary Config
cloudinary.config({ 
    cloud_name: 'dahpyu601', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Admin Dashboard
exports.getAdminDashboard = (req, res, next) =>{
    User.findById(req.session.user).populate('postId').then(blogs => {
        res.render('admin/blog',{
            pageTitle:'Admin Dashboard',
            blogs: blogs.postId,
        })
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
};

// Edit Post
exports.editPost = (req, res) =>{
    const postId = req.params.postId
    Blog.findOne({_id: postId }).then(blog =>{
        res.render('admin/editBlog',{
            pageTitle:'Edit Post',
            blog:blog,
            error: req.flash('error'),
        })
    })
};

// Post Update
exports.postUpdate = (req, res) => {
    const postId = req.params.postId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedArticle = req.body.article;
 

    const error = validationResult(req)
    if(!error.isEmpty()){
        req.flash('error', error.array())
        return res.status(422).redirect(`/admin/edit/${postId}`)
    }

    Blog.findOne({_id: postId}).then(blog =>{
        blog.title = updatedTitle;
        if(image){
            cloudinary.uploader.destroy(blog.image_id);
            cloudinary.uploader.upload(image.path).then(results =>{
                blog.image = results.secure_url;
                blog.image_id = results.public_id
            })
            // blog.image = `/${image.path}`
        }
        blog.article = updatedArticle;
        return blog.save();
    }).then(results =>{
        res.redirect('/admin');
    }).catch(err =>{
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
}

// New Post 
exports.getEditPostPage = (req, res) => {
    res.render('admin/newPost',{
        pageTitle: 'New Post',
        error: req.flash('error'),
        oldData: req.flash('oldData')
    }) 
};

// Post New Post
exports.postNewBlogPost = (req, res, next) => {

    const error = validationResult(req)
    if(!error.isEmpty()){
        req.flash('error', error.array())
        req.flash('oldData', {
            title: req.body.title,
            article: req.body.article
        })
        return res.status(422).redirect('/admin/add_post')
    }

    const title = req.body.title;
    const image = req.file.path;
    const article = req.body.article;
    let id;

    cloudinary.uploader.upload(image).then(results =>{
        return results;
    }).then(results =>{
        const blog = new Blog({title: title, image: results.secure_url, image_id: results.public_id, article: article, userId: req.session.user._id});
        return blog;
    }).then(blog => {
        return blog.save()
    }).then(results =>{
        if(req.file === undefined){
            req.flash('error', ['Incorrect Image Format. Must be png, jpeg or jpg'])
            req.flash('oldData', {
                title: req.body.title,
                imageURL: req.body.imageURL,
                article: req.body.article
            })
            return res.status(422).redirect('/admin/add_post')
        }
        id = results._id;
        return User.findById(req.session.user)
    }).then(user =>{
        user.postId.push(id)
        return user.save();
    }).then(results =>{
        // req.flash('info','Blog successfully added')
        return res.redirect('/admin')
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
};

//Delete Post
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Blog.findById({_id: postId}).then(blog =>{
        return cloudinary.uploader.destroy(blog.image_id)
    }).then(results =>{
        return Blog.findOneAndRemove({_id: postId})
    }).then(blog=>{
        // alert('Blog successfully deleted');
        return blog
    }).then(blog =>{
        return User.findById(blog.userId)
    }).then(user =>{
        user.postId.pull(postId)
        return user.save();
    }).then(results =>{
        res.redirect('/admin');
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
};

