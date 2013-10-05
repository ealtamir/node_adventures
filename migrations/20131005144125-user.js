var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('usuario', {
        id: {type: 'int', primaryKey: true, autoIncrement: true},
        username: {type: 'string', length: 128, unique: true, notNull: true },
        password: {type: 'string', length: 128, notNull: true},
        active: {type: 'boolean', defaultValue: false}
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('usuario', callback);
};
