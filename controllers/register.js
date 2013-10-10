var pg = require('pg');
var helpers = require('../helpers');
var models = require('../models');

exports.register = function(req, res) {

    var username = '';
    var password = '';
    var body = req.body;
    var state = {};
    var app = req.app;
    var o = [];

    var q_str = 'SELECT COUNT(*) FROM usuario WHERE username = $1';
    var i_str = '';

    var valid = helpers.check_valid(body.register_usr, body.register_psw);

    if (valid && body.register_email === '') {

        username = helpers.sanitize(body.register_usr);
        password = helpers.sanitize(body.register_psw);


        models.query_db([username], app, q_str, function(result) {
            if (result.rows[0].count === '0') {
                o[0] = username;
                o[1] = password;
                o[2] = '0';
                o[3] = helpers.getTimestamp();

                i_str = 'INSERT INTO usuario (username, password, active, timestamp)' +
                    ' VALUES(' + '\'' + o.join('\',\'') + '\'' +')';

                console.log(i_str);

                models.query_db([], app, i_str, function(result) {
                    console.log('registración completada');
                    helpers.set_flash({
                        status: 'success',
                        msg: 'La registración se completó con éxito.'
                    });
                });
            } else {
                console.log('ya hay usuarios con este nombre.');
                console.log(result);
                helpers.set_flash({
                    status: 'success',
                    msg: 'Ese nombre de usuario ya está registrado.'
                });
            }

            res.redirect(app.locals.reverse('index', {}));
        });
    } else {
        console.log('Problems with username and/or password.');

        helpers.set_flash({
            status: 'failure',
            msg: 'Tu nombre de usuario o contraseña fueron incorrectos.'
        });

        state.r_un = body.register_usr || '';

        res.redirect(app.locals.reverse('index', state));
    }
};
