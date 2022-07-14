//404 Page
exports.get404 = (req, res, next) => {
    res.status(404).render('errors/404', {
        pageTitle: 'Error'
    });
};

exports.get500 = (req, res, next) =>{
    res.status(500).render('errors/500',{
        pageTitle: '500'
    });
};