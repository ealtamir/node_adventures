var app_file    = require('./app');
var helpers     = require('./helpers');
var pg          = require('pg');

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
            console.log('Error when executing query.');
            // done() not required.
        });

        query.on('end', function(result) {
            callback(result);
            done();
        });
    });
}

exports.sql = (function() {
    this.GET_REVIEWS = "SELECT r.id, r.positive, r.negative, r.comment, r.timestamp, " +
        "s.dinamica, s.conocimientos, s.claridad, s.pasion, s.compromiso, s.exigencia " +
        "FROM review as r " +
        "INNER JOIN score as s ON r.score_id = s.id " +
        "WHERE r.professor_id = " +
        "(SELECT id FROM professor WHERE (name || ' ' || last_name) ILIKE $1)";

    return this;
}());
