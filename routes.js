var main  = require('./routes/index');
var user    = require('./routes/user');

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

    for( var i = 0, url = null; i < urls.length; i++) {
        url = urls[i];
        app.set(url.name, url.pattern);
        app.all(url.pattern, url.view);
    }

    app.locals.reverse = function(name) {
        return app.get(name) || '';
    };
};

