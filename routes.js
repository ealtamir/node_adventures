var main    = require('./controllers/index');
var user    = require('./controllers/user');
var auth    = require('./controllers/auth');
var rgstr   = require('./controllers/register');
var mware   = require('./middleware');

var urls = [
    {
        pattern: '/',
        view: main.index,
        name: 'index'
    },
    {
        pattern: '/auth',
        view: auth.authenticate,
        name: 'auth'
    },
    {
        pattern: '/register',
        view: rgstr.register,
        name: 'register'
    }
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
};
