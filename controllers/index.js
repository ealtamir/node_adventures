var helpers = require('../helpers');
var models  = require('../models');

exports.index = index;

function index(req, res) {

    var query = req.query;
    var q_str = 'SELECT * FROM usuario WHERE username = $1';
    var state = req.state;

    state.q = query.q;

    console.log(req.state);

    if (query.q) {
        models.query_db([query.q], req.app, q_str, function(result) {
            res.render('professor', { state: req.state, rows: result.rows });
        });
    } else {
        helpers.custom_render(res, req, 'index', {});
    }
}

