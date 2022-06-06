exports.getAllPosts = (req,res) => {
    res.render('blog/index',{
        path: '/',
        pageTitle: 'KachiCode'
    })
};

exports.getPost = (req,res) => {
    let title = req.params.title
    res.render('blog/post',{
        pageTitle:title
    })
};

exports.getAuthor = (req,res) => {
    res.render('blog/author',{
        path:'/author',
        pageTitle:'About Author'
    })
};