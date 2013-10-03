var main  = require('./routes/index');
var user    = require('./routes/user');

exports.Routes = function(app) {

    app.get('/', main.index);
    app.get('/users', user.list);

};
