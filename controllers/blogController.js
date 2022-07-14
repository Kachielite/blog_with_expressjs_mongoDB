const { populate } = require('../models/blogModel');
const Blogs = require('../models/blogModel');

exports.getHome = (req, res, next) =>{
    Blogs.find().populate('userId').then(blogs =>{
        res.render('blog/index', {
            pageTitle: 'Blog',
            blogs: blogs,

        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
};

exports.getPostDetails = (req, res, next) => {
    const postId = req.params.postId;
    let blog;
    let blogs;

    Blogs.find({_id:{"$ne":postId}}).populate('userId').then(blogPosts =>{
        blogs = blogPosts;
        return Blogs.findById(postId).populate('userId')
    }).then(blogPost =>{
        blog = blogPost
        res.render('blog/post',{
            pageTitle: 'Post details',
            blog: blog,
            blogs: blogs,

        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error) 
    })
}

exports.getAuthorDetails = (req, res) => {
    res.render('blog/author',{
        pageTitle: 'Author details',
        author: [],
    })
}