var dbm     = require('db-migrate');
var type    = dbm.dataType;
var async   = require('async');

exports.up = function(db, callback) {
    async.series([
        db.dropTable.bind(db, 'country'),
        db.createTable.bind(db, 'country', {
            id: {
                type: 'int',
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
            },
            country_code: { type: 'string', length: 3, notNull: true },
            name: { type: 'string', length: 128, notNull: true },
        })
    ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.dropTable.bind(db, 'country'),
        db.createTable(db, 'country', {
            id: {
                type: 'string',
                length: 2,
                primaryKey: true,
                notNull: true,
                unique: true
            },
            name: {
                type: 'string',
                length: 64,
                notNull: true
            },
        }),
    ], callback);
};
