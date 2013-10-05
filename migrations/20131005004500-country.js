var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('country', {
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

    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('country', callback);
};
