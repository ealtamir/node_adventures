var helpers = require('../helpers');
var models  = require('../models');
var _       = require('underscore');
var msgs    = require('../msgs');

// Constant
var MIN_QUERY_SIZE  = 3;

exports.prof_query      = prof_query;
exports.reviews_query   = reviews_query;
exports.submit_review   = submit_review;

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
            res.json(500, { error: 'Query was too short.' });
        }
    } else {
        res.json(500, { error: 'Method wasn\'t GET or wrong query.' });
    }
}

function reviews_query(req, res) {

    var name        = '';
    var params      = req.query || {};
    var q_str       = models.sql.GET_REVIEWS; // Params: name & last_name

    if (helpers.check_valid(params.name)) {
        name = helpers.sanitize(params.name);

        models.query_db([name], req.app, q_str, function(result) {
            res.json(200, {
                data: (result.rowCount !== 0)? result.rows : {}
            });
        });
    } else {
        res.json(500, {
            error: 'Invalid query. name isn\'t valid.'
        });
    }
}

function submit_review(req, res) {

    var name            = '';
    var review_valid    = null;
    var q_str           = '';
    var username        = '';

    if (req.route.method.toUpperCase() !== 'POST')
        res.json(500, { error: 'Request should be POST.' });


    review_valid = reviewIsValid(req.body);
    if (review_valid.passed === false)
        res.json(500, { error: review_valid });

    username = helpers.get_username(req.cookies.s, req.app);


}

function reviewIsValid(obj) {

    var type    = '';
    var result  = {
        errors : {},
        passed : true,
    };

    if (!!obj === false) {
        result.passed = false;
    } else {
        if (!!obj.comment === false || obj.comment.length > 3000) {
            type = 'comment';
            result.errors[type] = msgs.REVIEW_TEXT_ERR(type, 3000);
            result.passed = false;
        } else if (!!obj.advice === false || obj.advice.length > 100) {
            type = 'advice';
            result.errors[type] = msgs.REVIEW_TEXT_ERR(type, 100);
            result.passed = false;
        }

        _.each(obj.score, function(val, key, list) {
            if (val <= 0 || val > 5) {
                result.errors[key] = msgs.REVIEW_TEXT_ERR(type);
                result.passed = false;
            }
        });
    }

    return result;
}
