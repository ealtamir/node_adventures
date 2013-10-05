var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('department', {
        id: { type: 'int', primaryKey: 'true', autoIncrement: 'true' },
        name: { type: 'string', length: '128', notNull: 'true' }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('department', callback);
};
