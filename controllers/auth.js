var models = require('../models');

exports.authenticate = function(req, res) {

    var app = req.app;
    var body = req.body;
    var msg = '';
    var state = {};
    var val = false;

    if (body.login_usr &&
        body.login_pw  &&
        body.login_email === '') {

    } else {

    }

    state.l_un = body.login_usr || '';

    res.redirect( app.locals.reverse(
        'index', state
    ));
};
