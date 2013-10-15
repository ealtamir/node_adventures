var helpers = require('../helpers');
var models  = require('../models');

exports.professor = professor;

function professor(req, res) {

    var query = req.query || {};
    var q_str = 'SELECT * FROM professor WHERE name ' +
        'LIKE %$1% OR last_name LIKE %$1%;';
    var q = '';

    if (query.q) {
        q = helpers.sanitize(query.q);

        models.query_db([q], req.app, q_str, function(result) {
            if (result.rowCount !== 0) {
                res.render('professor', { rows: results.rows });
            } else {
                res.render('professor', { rows: {} });
            }
        });
    } else {
        res.render('professor', { rows: {} });
    }
}
