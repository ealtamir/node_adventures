var pg = require('pg');

exports.query_db = function(query, app) {

    var q_result = null;
    var client = new pg.Client(app.get('db_string'));

    client.connect(function(err) {
        if (err) {
            return console.error('error running quer', err);
        }
        client.query(sql_query, function(err, result) {
            if (err) {
                return console.error('error running query', err);
            }

            q_result = result;

            client.end();
        });

    });

};
