var helpers = require('./helpers');
var regex   = require('./msgs').regex;

exports.setFlash = setFlash;
exports.checkAuth = checkAuth;

function setFlash(req, res, next) {
    var str = req.cookies.flash;


    req.state = req.state || {};

    if (str !== undefined) {
        str = JSON.parse(str);
        req.state.flash = str;
    }

    res.clearCookie('flash');
    next();
}

function checkAuth(req, res, next) {
    var authData = req.cookies.s;

    if (!!authData === true)
        authData = helpers.sym_decrypt(authData, req.app);

    if (!!authData === false || !helpers.regex.EMAIL_VALIDATOR.test(authData))
        req.session = null;

    next();
}
