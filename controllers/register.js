var pg = require('pg');
var helpers = require('./helpers');

exports.register = function(req, res) {

    var body = req.body;
    var state = {};
    var app = req.app;
    var q_str = 'SELECT COUNT(*) FROM usuario WHERE username = $1';

    if (body.register_usr &&
        body.register_psw &&
        body.register_email === '') {

        helpers.db_query([username], app, q_str, function(result) {
            console.log(result);

            helpers.set_flash({
                status: 'success',
                msg: 'La registración se completó con éxito.'
            });

            res.redirect(app.locals.reverse('index', {}));
        });
    } else {
        helpers.set_flash({
            status: 'failure',
            msg: 'Tu nombre de usuario o contraseña fueron incorrectos.'
        });

        state.r_un = body.register_usr || '';

        res.redirect(app.locals.reverse('index', state));
    }
};
