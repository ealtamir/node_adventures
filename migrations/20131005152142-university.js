var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
    async.series([
        db.createTable.bind(db, 'university', {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            name: { type: 'string', length: 128, notNull: true },
            country_id: { type: 'int', notNull: true },
            province_id: { type: 'int' }
        }),
        db.createTable.bind(db, 'university_department_table', {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            university_id: { type: 'int', notNull: true},
            department_id: { type: 'int', notNull: true}
        })
    ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.dropTable.bind('university'),
        db.dropTable.bind('university_department_table')
    ], callback);
};
