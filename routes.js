var main    = require('./controllers/index');
var user    = require('./controllers/user');

var urls = [
    {
        pattern: '/',
        view: main.index,
        name: 'index'
    },
    {
        pattern: '/users',
        view: user.list,
        name: 'users'
    }
];

exports.Routes = function(app) {

    urls.forEach(function(url) {
        app.set(url.name, url.pattern);
        app.all(url.pattern, url.view);
    });

    app.locals.reverse = function(name) {
        return app.get(name) || '';
    };
};

