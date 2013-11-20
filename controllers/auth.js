var crypto      = require('crypto');
var helpers     = require('../helpers');
var models      = require('../models');
var m           = require('../msgs').msg;

exports.authenticate    = authenticate;
exports.login           = login;

function authenticate(req, res) {

    var app         = req.app,
        body        = req.body,
        password    = '',
        q_str       = models.sql.USERNAME_QUERY,
        state       = req.state,
        user        = null,
        username    = '';

    var valid = helpers.check_valid(body.username, body.login);

    if (valid && body.login_email === '') {
        username = helpers.sanitize(body.login_usr);

        models.query_db([username], app, q_str, function(result) {

            if (result.rowCount === 1) {
                user = result.rows[0];
                password = helpers.seed_encrypt(
                    helpers.sanitize(body.login_psw),
                    helpers.getTimestamp(user.timestamp),
                    app
                );

                if (password === user.password) {
                    helpers.login_user(username, req, res);
                    helpers.set_flash(m.LOGIN_SUCCESSFUL, res);
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
}

// Used for ajax authentication.
function login(req, res) {

    var app         = req.app,
        body        = req.body,
        password    = '',
        q_str       = models.sql.CHK_VALID_USERNAME,
        status      = null,
        state       = req.state,
        user        = null,
        username    = '';


    var valid = helpers.check_valid(body.username, body.password);

    if (valid && body.email === '') {
        username = helpers.sanitize(body.username);

        models.query_db([username], app, q_str, function(result) {
            status = m.WRONG_USR_PWD;
            if (result.rowCount === 1) {
                user = result.rows[0];
                password = helpers.seed_encrypt(
                    helpers.sanitize(body.password),
                    helpers.getTimestamp(user.timestamp),
                    app
                );
                if (password === user.password) {
                    helpers.login_user(username, req, res);
                    status = m.LOGIN_SUCCESSFUL;
                }
            }
            res.json(200, { result: status });
        });
    } else {
        res.json(200, { result: m.WRONG_USR_PWD });
    }
}
