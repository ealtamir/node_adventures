var helpers = require('../helpers');
var models  = require('../models');

exports.get_prof = get_prof;

function get_prof(req, res) {

    var query   = req.query || {};

    if (query.q && req.params.id === undefined) {
        process_query(req, res, query);
    } else if (req.params.id) {
        serve_professor(req, res, query);
    } else {
        helpers.set_flash({
            status: 'fail',
            msg: 'Los datos de búsqueda no son válidos.'
        }, res);
        res.render('professor', { rows: {} });
    }
}

function process_query(req, res, query) {
    var q_str   = "SELECT  FROM professor WHERE ";

    // the $? gets replaced, careful with changing '?'.
    var pattern = "name ILIKE ( '%' || $? || '%' ) OR last_name ILIKE ( '%' || $? || '%' )";
    var q       = '';
    var max_par = 5;

    q = helpers.sanitize(query.q);
    q = q.split(' ');

    for (var i = 0; i < q.length && i < max_par; i++) {
        q_str += pattern.replace(/\?/g, i + 1);
        q_str += (i + 1 < q.length && i + 1 < max_par)? ' OR ': ';';
    }

    models.query_db(q, req.app, q_str, function(result) {
        if (result.rowCount !== 0) {
            console.log(result.rows);
            res.render('professor', { rows: result.rows });
        } else {
            res.render('professor', { rows: {} });
        }
    });
}

function serve_professor(req, res, query) {

    var q_str   = "SELECT * FROM professor WHERE id = $1;";

    models.query_db([req.params.id], req.app, q_str, function(result) {
        if (result.rowCount === 1) {
            res.render('professor_view', { rows: result.rows });
        } else {
            res.render('professor', { rows: {} });
        }
    });
}
