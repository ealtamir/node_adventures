var main        = require('./controllers/index');
var user        = require('./controllers/user');
var auth        = require('./controllers/auth');
var rgstr       = require('./controllers/register');
var ajax        = require('./controllers/ajax');
var professors  = require('./controllers/professors');
var mware       = require('./middleware');

var urls = [
    {
        pattern : '/',
        view    : main.index,
        name    : 'index'
    },
    {
        pattern : '/auth',
        view    : auth.authenticate,
        name    : 'auth'
    },
    {
        pattern : '/register',
        view    : rgstr.register,
        name    : 'register'
    },
    {
        pattern : '/professor',
        view    : professors.get_prof,
        name    : 'professor'
    },
    {
        pattern : '/professor/:id(\\d+)',
        view    : professors.get_prof,
        name    : 'get_prof'               // Has no name.
    },

    // Ajax calls
    {
        pattern : '/prof_query',
        view    : ajax.prof_query,
        name    : ''
    },

    // Catch all
    {
        pattern : '*',
        view    : function(req, res) { res.render('404', {}); },
        name    : '404'
    },
];

exports.Routes = function(app) {

    var middleware = [];

    middleware.push(mware.setFlash);

    urls.forEach(function(url) {
        app.set(url.name, url.pattern);
        app.all(url.pattern, middleware, url.view);
    });

    app.locals.reverse = function(name, params) {
        var str = '';

        if (params) {
            str = '?';

            for( var key in params) {
                if (params[key] !== '') {
                    str += key + '=' + params[key];
                }
            }
            return app.get(name) + str || '';
        }

        return app.get(name) || '';
    };
    // Adds param to the main route: /user/1 (param == 1).
    app.locals.param_rev = function(name, params) {
        console.error('not implemented');
    };
};
