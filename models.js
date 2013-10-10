var pg = require('pg');
var crypto = require('crypto');
var helpers = require('./helpers');
var app_file = require('./app');

exports.query_db    = query_db;

function query_db(params, app, q_str, callback) {
    var db_str = app.get('db_string');
    var query = null;

    pg.connect(db_str, function(err, client, done) {
        if (err)
            return console.error('Error at requesting a connection from the pool.');

        query = client.query(q_str, params);

        query.on('row', function(row, result) {
            result.addRow(row);
        });

        query.on('error', function(err) {
            console.log('Error when executing register query');
        });

        query.on('end', function(result) {
            callback(result);
            done();
        });
    });
}
