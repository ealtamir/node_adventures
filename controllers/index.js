var helpers = require('../helpers');
var models = require('../models');

exports.index = function(req, res) {

    var query = req.query;

    console.log(req.params);
    console.log(query);

    if (query.q) {
        var q_result = null;
        var sql_query = 'SELECT * FROM usuario WHERE ' +
        'username = ' + '\'' + helpers.sanitize(query) + '\';';

        q_result = models.query_db(query, req.app);
        console.log(q_result);
    }

    res.render('index', { title: 'Express', query: query });

};

