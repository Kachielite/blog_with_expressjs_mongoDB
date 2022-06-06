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
}


exports.getAllPost = (req,res) => {
    res.render('admin/blog',{
        pageTitle:'Admin Dashboard'
    })
}

exports.addNewPost = (req,res) => {
    res.render('admin/newPost',{
        path:'/admin/add_post',
        pageTitle:'Add New Post'
    })
}