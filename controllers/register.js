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
                o[0] = username;
                o[1] = password;
                o[2] = 'FALSE';
                o[3] = helpers.getTimestamp();

                i_str = 'INSERT INTO usuario (username, password, active, timestamp)' +
                    ' VALUES(' + '\'' + o.join('\',\'') + '\'' +')';

                models.query_db([], app, i_str, function(result) {
                    helpers.set_flash(m.REGISTRATION_SUCCESS, res);
                });
            } else {
                helpers.set_flash(m.REGISTRATION_FAILURE, res);
            }

            res.redirect(app.locals.reverse('index', {}));
        });
    } else {
        helpers.set_flash(m.WRONG_USR_PWD, res);

        state.r_un = body.register_usr || '';

        res.redirect(app.locals.reverse('index', state));
    }
};
