
exports.register = function(req, res) {

    var body = req.body;
    var msg = '';
    var state = {};
    var app = req.app;

    if (body.register_usr &&
        body.register_psw &&
        body.register_email === '') {

    } else {

    }

    res.redirect( app.locals.reverse(
        'index', { r_un: body.register_usr || '' }
    ));
};
