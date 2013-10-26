var helpers = require('../helpers');
var models  = require('../models');

exports.get_prof    = get_prof;
exports.serve_prof  = serve_prof;

function get_prof(req, res) {

    var max_par = 5;
    var q       = '';
    var query   = req.query || {};

    var q_str   = "SELECT * FROM professor WHERE ";
    // the $? gets replaced, careful with changing '?'.
    var pattern = "name ILIKE ( '%' || $? || '%' ) OR last_name ILIKE ( '%' || $? || '%' )";

    if (query.q) {
        q = helpers.sanitize(query.q);
        q = q.split(' ');

        for (var i = 0; i < q.length && i < max_par; i++) {
            q_str += pattern.replace(/\?/g, i + 1);
            q_str += (i + 1 < q.length && i + 1 < max_par)? ' OR ': ';';
        }

        models.query_db(q, req.app, q_str, function(result) {
            if (result.rowCount !== 0) {
                res.render('professor', { rows: result.rows });
            } else {
                res.render('professor', { rows: [] });
            }
        });
    } else {
        helpers.set_flash({
            status: 'fail',
            msg: 'Los datos de búsqueda no son válidos.'
        }, res);
        res.render('professor', { rows: {} });
    }
}

function serve_prof(req, res, query) {

    var MAX_LEN     = 50;   // "constant"

    var app         = req.app;
    var params      = '';
    var prof_name   = req.params.prof_name;
    var regex       = /^([a-zA-Z]+-)*([a-zA-Z]+)$/g;

    var q_str       = "SELECT * FROM professor WHERE POSITION(LOWER(name) in $1) > 0 AND " +
        "POSITION(LOWER(last_name) in $1) > 0 AND CHAR_LENGTH(CONCAT(name, ' ',last_name)) = CHAR_LENGTH($1);";

    if (prof_name !== undefined && regex.test(prof_name)) {
        prof_name = prof_name.slice(0, MAX_LEN).replace(/-/g, ' ');

        models.query_db([prof_name], req.app, q_str, function(result) {
            if (result.rowCount === 1) {
                res.render('professor_view', { rows: result.rows });
            } else {
                res.redirect(app.locals.reverse('professor'));
            }
        });
    } else {
        res.redirect(app.locals.reverse('professor'));
    }

}
