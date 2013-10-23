var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.addColumn('university', {
        code: { type: 'string', length: 10, notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.removeColumn('university', 'code', callback);
};
