var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    var columnSpec = { type: 'timestamp', notNull: true };

    db.addColumn('usuario', 'timestamp', columnSpec, callback);
};

exports.down = function(db, callback) {
    db.removeColumn('usuario', 'timestamp', callback);
};
