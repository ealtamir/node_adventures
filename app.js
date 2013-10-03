
// Node Modules
var express = require('express');
var http    = require('http');
var path    = require('path');

// User Modules
var helpers = require('./helpers');
var routes  = require('./routes');
var user    = require('./routes/user');


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
//app.use(express.bodyParser());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

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
