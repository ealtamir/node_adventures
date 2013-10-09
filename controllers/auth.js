
exports.authenticate = function(req, res) {

    var body = req.body;
    var msg = '';
    var state = {};
    var app = req.app;

    if (body.login_usr &&
        body.login_pw  &&
        body.login_email === '') {

    } else {

    }

    res.redirect( app.locals.reverse(
        'index', { l_un: body.login_usr || '' }
    ));
};
