var pg      = require('pg');
var helpers = require('../helpers');
var models  = require('../models');
var m       = require('../msgs').msg;

exports.register = function(req, res) {

    var app = req.app;
    var body = req.body;
    var i_str = '';
    var o = [];
    var password = '';
    var state = req.state;
    var username = '';

    var q_str = 'SELECT COUNT(*) FROM usuario WHERE username = $1';

    var valid = helpers.check_valid(body.register_usr, body.register_psw);

    if (valid && body.register_email === '') {

        username = helpers.sanitize(body.register_usr);
        password = helpers.sanitize(body.register_psw);

        models.query_db([username], app, q_str, function(result) {
            if (result.rows[0].count === '0') {
                timestamp   = helpers.getTimestamp();
                password    = helpers.seed_encrypt(password, timestamp, app);

                console.log(timestamp);

                o[0] = username;
                o[1] = password;
                o[2] = 'FALSE';
                o[3] = timestamp;

                i_str = 'INSERT INTO usuario (username, password, active, timestamp)' +
                    ' VALUES(' + '\'' + o.join('\',\'') + '\'' +')';

                models.query_db([], app, i_str, (function(m, res) {
                    return function(result) {
                        helpers.set_flash(m.REGISTRATION_SUCCESS, res);
                        res.redirect(app.locals.reverse('index', {}));
                    };
                }(m, res)));
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
};
