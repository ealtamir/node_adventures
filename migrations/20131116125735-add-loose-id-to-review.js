var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.addColumn('review', 'loose_id', {
        type: 'string', length: 128
    }, callback);
};

exports.down = function(db, callback) {
    db.removeColumn('review', 'loose_id', callback);
};
