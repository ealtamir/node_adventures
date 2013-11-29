/* jshint multistr: true */

var app_file    = require('./app'),
    helpers     = require('./helpers'),
    pg          = require('pg'),
    _           = require('underscore');

exports.query_db    = query_db;

function query_db(params, app, q_str, callback) {
    var db_str = app.get('db_string');
    var query = null;

    pg.connect(db_str, function(err, client, done) {
        if (err)
            return console.error('Error at requesting a connection from the pool.');

        query = client.query(q_str, params);

        query.on('row', function(row, result) {
            result.addRow(row);
        });

        query.on('error', function(err) {
            console.log('Error when executing query.');
            // done() not required.
        });

        query.on('end', function(result) {
            callback(result);
            done();
        });
    });
}

exports.sql = (function() {
    var o = {};

    o.CHK_VALID_USERNAME = 'SELECT * FROM usuario WHERE username = $1';

    o.GET_PROFESSOR = "                                             \
        WITH prof_id AS (                                               \
            SELECT id FROM professor                                    \
            WHERE (name || ' ' || last_name) ILIKE $1                   \
        ),                                                              \
        scores AS (                                                     \
            SELECT                                                      \
                AVG(score.dinamica) as dinamica,                        \
                AVG(score.conocimientos) as conocimientos,              \
                AVG(score.claridad) as claridad,                        \
                AVG(score.pasion) as pasion,                            \
                AVG(score.compromiso) as compromiso,                    \
                AVG(score.exigencia) as exigencia                       \
            FROM score, review, prof_id                                 \
            WHERE review.professor_id = prof_id.id                      \
            AND                                                         \
            review.score_id = score.id                                  \
        ),                                                              \
        departments AS (                                                \
            SELECT name                                                 \
            FROM                                                        \
                department,                                             \
                professor_department_table as pdt,                      \
                prof_id                                                 \
            WHERE pdt.professor_id = prof_id.id                         \
            AND                                                         \
            pdt.department_id = department.id                           \
        ),                                                              \
        universities AS (                                               \
            SELECT u.name, u.code                                       \
            FROM                                                        \
                professor, university as u,                             \
                professor_university_table as put,                      \
                prof_id                                                 \
            WHERE                                                       \
                put.professor_id = professor.id                         \
                AND u.id = put.id                                       \
                AND professor.id = prof_id.id                           \
        )                                                               \
        SELECT DISTINCT scores.*, p.*, d.name as d_name,                \
            u.name as u_name, u.code as u_code                          \
        FROM                                                            \
            scores, professor as p, departments as d,                   \
            universities as u, prof_id                                  \
        WHERE p.id = prof_id.id                                         \
    ";

    o.GET_REVIEWS = "                                               \
        SELECT                                                      \
            r.id, r.positive, r.negative, r.comment, r.timestamp,   \
            s.dinamica, s.conocimientos, s.claridad, s.pasion,      \
            s.compromiso, s.exigencia                               \
        FROM                                                        \
            review as r                                             \
        INNER JOIN                                                  \
            score as s ON r.score_id = s.id                         \
        WHERE r.professor_id =                                      \
        (                                                           \
            SELECT id                                               \
            FROM professor                                          \
            WHERE                                                   \
                (name || ' ' || last_name) ILIKE $1                 \
        )";

    o.SUBMIT_REVIEW = "                                             \
        WITH saved_score as (                                       \
            INSERT INTO score (                                     \
                dinamica, conocimientos, claridad, pasion,          \
                compromiso, exigencia, timestamp                    \
            )                                                       \
            SELECT ?score?, NOW()                                   \
            RETURNING id                                            \
        )                                                           \
        INSERT INTO review (                                        \
            positive, negative, comment, advice, user_id,           \
            professor_id, score_id, timestamp, loose_id             \
        )                                                           \
        SELECT                                                      \
            0, 0, $1, $2,                                           \
            usuario.id, professor.id, saved_score.id,               \
            NOW(), $3                                               \
        FROM                                                        \
            saved_score, usuario, professor                         \
        WHERE                                                       \
            usuario.id in (                                         \
                SELECT id                                           \
                FROM usuario                                        \
                WHERE username ILIKE $4                             \
            )                                                       \
            AND                                                     \
            professor.id in (                                       \
                SELECT id                                           \
                FROM professor                                      \
                WHERE (name || ' ' || last_name) ILIKE $5           \
            )                                                       \
    ";

    o.UNLOOSE_QUERY = "                                             \
        WITH user as (                                              \
            SELECT id FROM usuario WHERE username ILIKE $1          \
            RETURNING *                                             \
        )                                                           \
        UPDATE review                                               \
            SET user_id = user.id                                   \
        FROM user                                                   \
        WHERE review.loose_id = $2;                                 \
    ";

    var regex = /[ ]+/g;
    for (var str in o) {
        o[str] = o[str].replace(regex, ' ');
    }

    return o;
}());
