var crypto      = require('crypto');

var helpers     = require('../helpers');
var models      = require('../models');
var m           = require('../msgs').msg;

exports.authenticate = function(req, res) {

    var app         = req.app;
    var body        = req.body;
    var password    = '';
    var state       = req.state;
    var user        = null;
    var username    = '';

    var q_str = 'SELECT * FROM usuario WHERE username = $1;';

    var valid = helpers.check_valid(body.login_usr, body.login_psw);


    if (valid && body.login_email === '') {
        username = helpers.sanitize(body.login_usr);

        models.query_db([username], app, q_str, function(result) {

            console.log(result);
            console.log(result.rowCount === 1);

            if (result.rowCount === 1) {
                user = result.rows[0];
                password = helpers.seed_encrypt(
                    helpers.sanitize(body.login_psw),
                    helpers.getTimestamp(user.timestamp),
                    app
                );

                if (password === user.password) {
                    helpers.login_user(username, req, res);
                } else {
                    helpers.set_flash(m.WRONG_USR_PWD, res);
                }

            } else {
                helpers.set_flash(m.WRONG_USR_PWD, res);
            }
            res.redirect(app.locals.reverse('index', {}));
        });

    } else {
        helpers.set_flash(m.WRONG_USR_PWD, res);
        state.l_un = body.login_usr || '';

        res.redirect(app.locals.reverse('index', state));
    }
};
