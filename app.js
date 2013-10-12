
// Node Modules
var express = require('express');
var http    = require('http');
var path    = require('path');

// User Modules
var routes = require('./routes');

var app = express();

exports.App = function() { return app; };


/*
 * Settings
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('seed', 'dis will change ;)'); // seed
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Middleware
 */
app.use(express.favicon());
app.use(express.logger('dev')); // Choose position carefully
app.use(express.methodOverride());
app.use(express.urlencoded());
app.use(express.cookieParser('this will change :)'));

// Must go after middleware
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());

  var db_string = 'postgres://pr_dev:asd@localhost:5432/n_pr_dev';
}

// Load routes
routes.Routes(app);

// DB Settings
app.set('db_string', db_string);

/*
 * Server stuff
 */
var listenStr   = 'Express server listening on port ' + app.get('port');
var server      = http.createServer();

server.addListener('request', app);
server.listen(
    app.get('port'),
    function() {
        console.log(listenStr);
    }
);
