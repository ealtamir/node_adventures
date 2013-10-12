

exports.setFlash = function(req, res, next) {
    var str = req.cookies.flash;


    req.state = req.state || {};

    if (str !== undefined) {
        str = JSON.parse(str);
        req.state.flash = str;
    }

    res.clearCookie('flash');
    next();
};
