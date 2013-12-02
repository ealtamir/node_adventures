var main        = require('./controllers/index');
var auth        = require('./controllers/auth');
var rgstr       = require('./controllers/register');
var ajax        = require('./controllers/ajax');
var professors  = require('./controllers/professors');
var middleware  = require('./middleware');

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
        pattern : '/profesor',
        view    : professors.get_prof,
        name    : 'professor'
    },
    {
        pattern : '/profesor/:prof_name',
        view    : professors.serve_prof,
        name    : 'get_prof'
    },
    {
        pattern : '/logout',
        view    : auth.logout,
        name    : 'logout'
    },

    // Ajax calls
    {
        pattern : '/prof_query',
        view    : ajax.prof_query,
        name    : ''
    },
    {
        pattern : '/reviews_query',
        view    : ajax.reviews_query,
        name    : ''
    },
    {
        pattern : '/submit_review',
        view    : ajax.submit_review,
        name    : ''
    },
    {
        pattern : '/login',
        view    : auth.login,
        name    : 'login'
    },
    {
        pattern : '/ajax_register',
        view    : rgstr.ajax_register,
        name    : 'ajax_register'
    },

    // Catch all
    {
        pattern : '*',
        view    : function(req, res) { helpers.custom_render(res, req, '404', {}); },
        name    : '404'
    },
];

exports.Routes = function(app) {
    'use strict';
    var active_mdwre = [];

    active_mdwre.push(middleware.setFlash);
    active_mdwre.push(middleware.checkAuth);

    urls.forEach(function(url) {
        app.set(url.name, url.pattern);
        app.all(url.pattern, active_mdwre, url.view);
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
    app.locals.url_p_reverse = function(name, param_name, params) {
        var str = app.get(name);
        var pos = str.indexOf(param_name);

        if (pos > 0) {
            str = str.substring(0, pos);
            params.forEach(function(param, i, a) {
                str += param;
                str += (i + 1 < a.length)? '-': '';
            });
            str += '/';
        } else {
            str = '';
        }

        return str;
    };

    // TODO: Recordar para qué era esto...
    app.locals.params_from_row = function(row) {
        var result = row.name.split(' ').concat(row.last_name.split(' '));
        return result.map(function(s) { return s.toLowerCase(); });
    };
};

