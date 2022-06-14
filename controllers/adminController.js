const Blogs = require('../models/blogModel');
const Users = require('../models/userModel');

let errMessage = " ";

exports.getAdminPage = (req,res) => {
    res.render('admin/index',{
        path: '/admin',
        pageTitle: 'KachiCode',
        errMessage: ""
    })
};

exports.login = (req,res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    if (email === "test@co.co" || password === "password"){
        errMessage = " ";
        res.redirect('/admin/blog')
    } else{
        errMessage = true
        res.render('admin/index',{
            path: '/admin',
            errMessage: errMessage
        })
    }
    console.log(errMessage)
};


exports.getAllPost = (req,res) => {
    Blogs.findAll().then(blogs =>{
        res.render('admin/blog',{
            path: '/admin/add_post',
            pageTitle: 'Admin Dashboard',
            blogs: blogs
        })
    }).catch(err =>{
        console.log(err)
    })
}

exports.addNewPost = (req,res) => {
    res.render('admin/newPost',{
        path:'/admin/add_post',
        pageTitle:'Add New Post'
    })
};

exports.postNewPost = (req,res) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const article = req.body.article;

    Users.findByPk(1).then(user =>{
        user.createBlog({
            title: title,
            imageURL: imageURL,
            article: article
        })
    }).then(results =>{
        console.log(results)
        res.redirect('/admin/blog')
    })
    .catch(err => {
        console.log(err)
    })
};

exports.editPost = (req, res) =>{
    const id = req.params.id
    Blogs.findByPk(id).then(blog =>{
        res.render('admin/editBlog',{
            path:`/admin/edit:id`,
            pageTitle: "Edit Post",
            blog:blog
        })
    })
};

exports.postUpdate = (req,res) =>{
    const id = req.params.id;
    const updatedTitle = req.body.title;
    const updateImageURL = req.body.imageURL;
    const updatedArticle = req.body.article;

    Blogs.update({
        title: updatedTitle,
        imageURL: updateImageURL,
        article: updatedArticle,
    },{
        where: {id:id}
    }).then(results =>{
        console.log("blog updated");
        res.redirect('/admin/blog');
    })
    .catch(err =>{
        console.log(err)
    })
};

exports.deletePost = (req, res) =>{
    const id = req.params.id;
    Blogs.findByPk(id).then(blog =>{
        return blog.destroy();
    }).then(results =>{
        console.log("Post has been deleted");
        res.redirect('/admin/blog');
    }).catch(err =>{
        console.log(err)
    })
};



