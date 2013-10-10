var helpers = require('../helpers');
var models = require('../models');

exports.index = function(req, res) {

    var query = req.query;
    var q_str = 'SELECT * FROM usuario WHERE username = $1';

    console.log(req.params);
    console.log(query);

    if (query.q) {
        models.query_db([query.q], req.app, q_str, function(result) {
            console.log(result);
            res.render('index', { title: 'Express', query: query });
        });
    } else {
        res.render('index', { title: 'Express', query: query });
    }
};

