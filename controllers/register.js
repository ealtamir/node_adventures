var pg      = require('pg');
var helpers = require('../helpers');
var models  = require('../models');
var m       = require('../msgs').msg;

exports.register        = register;
exports.ajax_register   = ajax_register;

function register(req, res) {
    var app = req.app;
    var body = req.body;
    var i_str = '';
    var o = [];
    var password = '';
    var state = req.state;
    var username = '';

    var q_str = 'SELECT COUNT(*) FROM usuario WHERE username = $1';

    var valid = helpers.check_valid(body.username, body.password);

    if (valid && body.register_email === '') {

        username = helpers.sanitize(body.username);
        password = helpers.sanitize(body.password);

        models.query_db([username], app, q_str, function(result) {
            if (result.rows[0].count === '0') {
                timestamp   = helpers.getTimestamp();
                password    = helpers.seed_encrypt(password, timestamp, app);

                o[0] = username;
                o[1] = password;
                o[2] = 'FALSE';
                o[3] = timestamp;

                i_str = 'INSERT INTO usuario (username, password, active, timestamp)' +
                    ' VALUES(' + '\'' + o.join('\',\'') + '\'' +')';

                models.query_db([], app, i_str, (function(m, username, req, res) {
                    return function(result) {
                        helpers.set_flash(m.REGISTRATION_SUCCESS, res);
                        helpers.login_user(username, req, res);
                        res.redirect(app.locals.reverse('index', {}));
                    };
                }(m, username, req, res)));
            } else {
                helpers.set_flash(m.REGISTRATION_FAILURE, res);
                res.redirect(app.locals.reverse('index', {}));
            }
        });
    } else {
        helpers.set_flash(m.WRONG_USR_PWD, res);

        state.r_un = body.register_usr || '';

        res.redirect(app.locals.reverse('index', state));
    }
}

function ajax_register(req, res) {
    var app = req.app,
        body = req.body,
        params = [],
        password = '',
        q_str = models.sql.REGISTER_QUERY,
        result = {},
        timestamp = null,
        username = '';

    var valid = helpers.check_valid(body.username, body.password);

    if (valid && body.email === '') {
        timestamp = helpers.getTimestamp();

        params[0] = helpers.sanitize(body.username);
        params[1] = helpers.sanitize(body.password);
        params[1] = helpers.seed_encrypt(params[1], timestamp, app);
        params[2] = params[0]; params[3] = params[0];

        models.query_db(params, app, q_str, (function(req, res, username) {
            return function(result) {
                if (result.rowCount === 1) {
                    helpers.login_user(username, req, res);
                    result = m.REGISTRATION_SUCCESS;
                } else {
                    result = m.REGISTRATION_FAILURE;
                }
                return res.json(200, { result : result });
                };
            }(req, res, params[0]))
        );
    } else {
        result = m.WRONG_USR_PWD;
        return res.json(200, { result : result });
    }
}
