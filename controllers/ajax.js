var helpers     = require('../helpers');
var models      = require('../models');

// Constant
var MIN_QUERY_SIZE  = 3;

exports.prof_query = prof_query;

function prof_query(req, res) {
    var params  = req.query || {};
    var q       = '';

    var q_str   = "SELECT CONCAT(name, ' ', last_name) AS name " +
        "FROM professor WHERE LOWER(name) LIKE LOWER(( '%' || $1 || '%' )) " +
        "OR LOWER(last_name) LIKE LOWER(( '%' || $1 || '%' ));";

    if (req.method === 'GET' && params.q !== undefined) {
        q = helpers.sanitize(params.q);

        if (q.length <= MIN_QUERY_SIZE) {
            models.query_db([q], req.app, q_str, function(result) {
                console.log(result);
                res.json(200, {
                    data: (result.rowCount !== 0)? result.rows: {}
                });
            });
        } else {
            res.json(500, {error: 'Query was too short.'});
        }
    } else {
        res.json(500, {error: 'Method wasn\'t GET or wrong query.'});
    }
}
