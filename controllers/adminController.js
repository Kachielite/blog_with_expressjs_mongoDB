const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const {validationResult} = require('express-validator/check');



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
    const updatedImageURL = req.body.imageURL;
    const updatedArticle = req.body.article;

    Blog.findOne({_id: postId}).then(blog =>{
        blog.title = updatedTitle;
        blog.imageURL = updatedImageURL;
        blog.article = updatedArticle;
        return blog.save();
    }).then(results =>{
        res.redirect('/admin');
    }).catch(err =>{
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
            imageURL: req.body.imageURL,
            article: req.body.article
        })
        return res.status(422).redirect('/admin/add_post')
    }

    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const article = req.body.article;
    let id;

    const blog = new Blog({title: title, imageURL: imageURL, article: article, userId: req.session.user._id})
    blog.save().then(results =>{
        id = results._id;
        return User.findById(req.session.user)
    }).then(user =>{
        user.postId.push(id)
        return user.save();
    }).then(results =>{
        // req.flash('info','Blog successfully added')
        res.redirect('/admin')
    }).catch(err =>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
};

//Delete Post
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Blog.findOneAndRemove({_id: postId}).then(blog=>{
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

