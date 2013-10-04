var url_utils = require('url');

/*
 * GET home page.
 */
exports.index = function(req, res) {
    var parsed_url = url_utils.parse(req.url);
    res.render('index', { title: 'Express', url: parsed_url });
};
