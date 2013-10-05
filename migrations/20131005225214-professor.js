var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
    async.series([
        db.createTable.bind(db, 'professor', {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            name: { type: 'string', length: 64, notNull: true },
            last_name: { type: 'string', length: 64, notNull: true },
            twitter_url: { type: 'string', length: 256 },
            linkedin_url: { type: 'string', length: 256 },
            blog_url: { type: 'string', length: 256 },
            img_url: { type: 'string', length: 256 },
            timestamp: { type: 'timestamp', notNull: true }
        }),
        db.createTable.bind(db, 'professor_university_table', {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            professor_id: { type: 'int', notNull: true},
            university_id: { type: 'int', notNull: true}
        }),
        db.createTable.bind(db, 'professor_department_table', {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            professor_id: { type: 'int', notNull: true},
            department_id: { type: 'int', notNull: true}
        })

    ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.dropTable.bind('professor'),
        db.dropTable.bind('professor_university_table'),
        db.dropTable.bind('professor_department_table'),
    ], callback);
};
