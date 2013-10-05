
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


/*
 * Middleware
 */
app.use(express.favicon());
app.use(express.logger('dev')); // Choose position carefully
app.use(express.multipart);
app.use(express.methodOverride());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());

  var db_string = 'postgres://pf_dev:asd@localhost:5432/n_pf_dev';
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
