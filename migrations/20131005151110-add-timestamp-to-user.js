var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    var columnSpec = { type: 'timestamp', notNull: true };

    db.addColumn('user', 'timestamp', columnSpec, callback);
};

exports.down = function(db, callback) {
    db.removeColumn('user', 'timestamp', callback);
};
