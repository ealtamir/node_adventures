var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.addColumn('review', 'advice', {
        type: 'string', length: 150,
    }, callback);
};

exports.down = function(db, callback) {
    db.removeColumn('review', 'advice', callback);
};
