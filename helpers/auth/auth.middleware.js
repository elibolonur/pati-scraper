module.exports = {
    required: () => {
        return function (req, res, next) {
            if (req.session.isLoggedIn === true) {
                return next()
            }
            else if (req.session.isLoggedIn === false) {
                res.redirect('/')
            }
            else {
                req.session.isLoggedIn = false;
                console.log(req.session.isLoggedIn);
                res.redirect('/')
            }
            res.redirect('/')
        }
    }
};