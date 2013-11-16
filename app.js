
// Node Modules
var express = require('express');
var http    = require('http');
var path    = require('path');

// User Modules
var routes = require('./routes');

var app = express();


/*
 * Settings
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('hash_type', 'sha256');
app.set('cipher_type', 'aes192');
app.use(express.static(path.join(__dirname, 'public')));

// Seeds
app.set('seed', 'dis will change ;)');
app.set('cookie_seed', 'this will change too :)');
app.set('session', 'i think i\'ll change this toooo :P');
app.set('salt', 'key i use for several random stuff');

/*
 * Middleware
 */
app.use(express.favicon());
app.use(express.logger('dev')); // Choose position carefully
app.use(express.methodOverride());
app.use(express.urlencoded());
app.use(express.cookieParser(app.get('cookie_seed')));

// Must go after middlewares
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());

    var db_string = 'postgres://pr_dev:asd@localhost:5432/n_pr_dev';
} else if (process.env.NODE_ENV === 'production') {
    var db_string = process.env.DATABASE_URL;
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
