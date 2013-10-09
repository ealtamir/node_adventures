var url_utils = require('url');
var helpers = require('../helpers');
var pg = require('pg');
var App = require('../app');

exports.index = function(req, res) {
    app = App.App();

    if (req.method == 'GET') {
        get(req, res);
    } else {
        post(req, res);
    }

};

function get(req, res) {

    var query = req.query.q;

    if (query) {
        var client = new pg.Client(app.get('db_string'));

        var sql_query = 'SELECT * FROM usuario WHERE ' +
            'username = ' + '\'' + helpers.sanitize(query) + '\';';

        client.connect(function(err) {
            if (err) {
                return console.error('error running quer', err);
            }
            client.query(sql_query, function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                console.log(result);

                client.end();
            });

        });
    }

    res.render('index', { title: 'Express', url: query });
}

function post(req, res) {

    console.log(req.headers);
    console.log(req.body);

    res.render('index', { title: 'Express', url: '' });
}
