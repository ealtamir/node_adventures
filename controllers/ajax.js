var helpers = require('../helpers');
var models  = require('../models');
var _       = require('underscore');
var msgs    = require('../msgs').msg;

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

    var default_uname   = 'enzo.alt@gmail.com',
        name            = '',
        params          = [],
        post_params     = req.body,
        q_str           = models.sql.SUBMIT_REVIEW,
        result          = null,
        username        = '',
        loose_id        = '';

    result = doValidation(req, res, post_params);
    if (result !== null)
        return result;

    q_str = q_str.replace('?score?', post_params.score);

    username = req.state.session || default_uname;

    if (username === default_uname) {
        loose_id = set_loose_cookie(
            post_params.score, post_params.comment, req, res
        );
    }

    params = [post_params.comment, post_params.advice,
        loose_id, username, post_params.prof_name];

    models.query_db(params, req.app, q_str, (function(loose) {
            return function(result) {
                var response = {
                    data    : result.rows,
                    loose   : loose,
                };

                res.json(200, response);
            };
        }(username === default_uname))
    );
}

function doValidation(req, res, post_params) {

    var review_valid = null;

    if (req.route.method.toUpperCase() !== 'POST')
        return res.json(500, { error: 'Request should be POST.' });

    review_valid = reviewIsValid(post_params);
    if (review_valid.passed === false)
        return res.json(500, { error: review_valid });

    post_params.score = _.values(post_params.score).join(',');
    if (helpers.regex.SANITIZE_SCORE.test(post_params.score) === false)
        return res.json(500, { error: 'Score string didn\'t pass regex test.' });

    return null;
}

function reviewIsValid(obj) {

    var type    = '',
        result  = {
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

function set_loose_cookie(score, comment, req, res) {
    var loose_id        = '',
        old_loose_id    = '',
        new_loose_id    = '';

    loose_id = helpers.seed_encrypt(score + comment, '', req.app);
    old_loose_id = (req.cookies.loose)?
        helpers.sym_decrypt(req.cookies.loose, req.app): '';
    new_loose_id = ((old_loose_id)? old_loose_id + '-': '') + loose_id;
    new_loose_id = helpers.sym_encrypt(new_loose_id, req.app);

    res.cookie('loose', new_loose_id, {
        // expires an hour later
        expiration: new Date(Date.now() + 1000 * 60 * 30),
    });

    return loose_id;
}
