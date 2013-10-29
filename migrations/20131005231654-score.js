var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('score', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        dinamica:       { type: 'int', notNull: true},
        conocimientos:  { type: 'int', notNull: true},
        claridad:       { type: 'int', notNull: true},
        pasion:         { type: 'int', notNull: true},
        compromiso:     { type: 'int', notNull: true},
        exigencia:      { type: 'int', notNull: true},
        timestamp:      { type: 'timestamp', notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('score', callback);
};
