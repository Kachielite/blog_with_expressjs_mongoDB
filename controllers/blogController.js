const Blog = require('../models/blogModel');
const Users = require('../models/userModel');
const { Op } = require("sequelize");

exports.getAllPosts = (req,res) => {
    Blog.findAll({
        include:[{
            model: Users,
            required: false
        }]
    }).then(blogs =>{
        res.render('blog/index',{
            path: '/',
            pageTitle: 'KachiCode',
            blogs: blogs,
            users : blogs.getUser
        })
    }).catch(err =>{
        console.log(err)
    })
};

exports.getPost = (req,res) => {
    let id = req.params.id
    let blogs;
    Blog.findAll({
        where: {[Op.not]: {id:id}},
        limit: 3
    }).then(results=>{
        blogs = results
        Blog.findByPk(id).then(blog =>{
            res.render('blog/post',{
                pageTitle:"View Post",
                blog: blog,
                blogs: blogs
            })
        })
    }).catch(err=>{
        console.log(err)
    })
};

exports.getAuthor = (req,res) => {
    res.render('blog/author',{
        path:'/author',
        pageTitle:'About Author'
    })
};