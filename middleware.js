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

// Sets session information in state object for later use.
function checkAuth(req, res, next) {
    var auth_data = req.cookies.session;

    req.state = req.state || {};

    req.state.session = helpers.get_username(req);

    next();
}
