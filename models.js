/* jshint multistr: true */
var pg = require('pg');


function query_db(params, app, q_str, callback) {
    'use strict';
    var db_str = app.get('db_string');
    var query = null;

    pg.connect(db_str, function(err, client, done) {
        if (err) {
            return console.error(
                'Error at requesting a connection from the pool.'
            );
        }

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
    'use strict';
    var o = {};

    o.CHK_VALID_USERNAME = 'SELECT * FROM usuario WHERE username = $1';

    o.GET_PROFESSOR = '                                                 \
        WITH prof_id AS (                                               \
            SELECT id FROM professor                                    \
            WHERE (name || \' \' || last_name) ILIKE $1                 \
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
    ';

    o.GET_REVIEWS = '                                                   \
        SELECT                                                          \
            r.id,                                                       \
            r.comment,                                                  \
            r.timestamp,                                                \
            sum(vut.positive)       as pos,                             \
            sum(vut.negative)       as neg,                             \
            sum(s.dinamica)         as dinamica,                        \
            sum(s.conocimientos)    as conocimientos,                   \
            sum(s.claridad)         as claridad,                        \
            sum(s.pasion)           as pasion,                          \
            sum(s.compromiso)       as compromiso,                      \
            sum(s.exigencia)        as exigencia                        \
        FROM review as r                                                \
        LEFT OUTER JOIN vote_user_table vut                             \
        ON vut.review_id = r.id                                         \
        INNER JOIN score as s                                           \
        ON r.score_id = s.id                                            \
        WHERE                                                           \
            r.professor_id = (                                          \
                SELECT id                                               \
                FROM professor                                          \
                WHERE (name || \' \' || last_name)                      \
                ILIKE $1                                                \
            )                                                           \
            AND r.score_id = s.id                                       \
        GROUP BY r.id                                                   \
        ORDER BY pos DESC                                               \
    ;';

    o.SUBMIT_REVIEW = '                                             \
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
                WHERE (name || \' \' || last_name) ILIKE $5         \
            )                                                       \
    ';

    o.REGISTER_QUERY = '                                            \
        INSERT INTO                                                 \
            usuario (username, password, active, timestamp)         \
        SELECT                                                      \
            $1, $2, \'FALSE\', NOW()                                \
        WHERE                                                       \
            $3 NOT IN (                                             \
                SELECT username FROM usuario WHERE username ILIKE $4\
            );                                                      \
    ';

    o.UNLOOSE_QUERY = '                                             \
        WITH user as (                                              \
            SELECT id FROM usuario WHERE username ILIKE $1          \
            RETURNING *                                             \
        )                                                           \
        UPDATE review                                               \
            SET user_id = user.id                                   \
        FROM user                                                   \
        WHERE review.loose_id = $2;                                 \
    ';

    o.PROCESS_VOTE = '                                              \
        WITH updated AS (                                           \
            UPDATE vote_user_table v                                \
            SET                                                     \
                positive = $1,                                      \
                negative = $2                                       \
            FROM                                                    \
                usuario u                                           \
            WHERE                                                   \
                v.review_id = $3                                    \
                AND v.user_id = u.id                                \
                AND u.username ILIKE $4                             \
            RETURNING v.id                                          \
        )                                                           \
        INSERT INTO vote_user_table                                 \
            (review_id, user_id, positive, negative)                \
        SELECT                                                      \
            $3, u.id, $1, $2                                        \
        FROM                                                        \
            usuario u                                               \
        WHERE                                                       \
            NOT EXISTS (SELECT 1 FROM updated)                      \
            AND u.username ILIKE $4                                 \
    ;';

    var regex = /[ ]+/g;
    for (var str in o) {
        if (o.hasOwnProperty(str)) {
            o[str] = o[str].replace(regex, ' ');
        }
    }

    return o;
}());

exports.query_db    = query_db;
