exports.getAllPosts = (req,res) => {
    res.render('admin/index',{
        path: '/admin',
        pageTitle: 'KachiCode'
    })
};

exports.addNewPost = (req,res) => {
    res.render('admin/newPost',{
        path:'/admin/add_post',
        pageTitle:'Add New Post'
    })
}