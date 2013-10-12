var helpers = require('../helpers');
var models = require('../models');

exports.index = function(req, res) {

    var query = req.query;
    var q_str = 'SELECT * FROM usuario WHERE username = $1';

    console.log(req.state);

    if (query.q) {
        models.query_db([query.q], req.app, q_str, function(result) {
            console.log(result);
            req.state.q = query.q;
            res.render('index', { title: 'Express', state: req.state });
        });
    } else {
        req.state.q = query.q;
        res.render('index', { title: 'Express', state: req.state });
    }
};

