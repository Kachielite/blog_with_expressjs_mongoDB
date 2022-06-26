const Blog = require('../models/blogModel');
const User = require('../models/userModel');
let alert = require('alert'); 

// Admin Dashboard
exports.getAdminDashboard = (req, res) =>{
    Blog.find().then(blogs => {
        res.render('admin/blog',{
            pageTitle:'Admin Dashboard',
            blogs: blogs
        })
    }).catch(err =>{
        console.log(err)
    })
};

// Edit Post
exports.editPost = (req, res) =>{
    const postId = req.params.postId
    Blog.findOne({_id: postId }).then(blog =>{
        res.render('admin/editBlog',{
            pageTitle:'Edit Post',
            blog:blog
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
        alert('Blog successfully updated');
        res.redirect('/admin/blog');
    }).catch(err =>{
        console.log(err)
    })
}

// New Post 
exports.getEditPostPage = (req, res) => {
    res.render('admin/newPost',{
        pageTitle: 'New Post'
    }) 
};

// Post New Post
exports.postNewBlogPost = (req, res) => {

    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const article = req.body.article;
    let id;

    const blog = new Blog({title: title, imageURL: imageURL, article: article, userId: '62b33bebe76af7b17598fe12'})
    blog.save().then(results =>{
        id = results._id;
        return User.findOne()
    }).then(user =>{
        user.postId.push(id)
        return user.save();
    }).then(results =>{
        alert('Blog successfully added')
        res.redirect('/admin/blog')
    }).catch(err =>{
        console.log(err)
    })
};

//Delete Post
exports.deletePost = (req, res) => {
    const postId = req.params.postId;
    Blog.findOneAndRemove({_id: postId}).then(results=>{
        alert('Blog successfully deleted');
        res.redirect('/admin/blog');
    }).catch(err =>{
        console.log(err)
    })
};

