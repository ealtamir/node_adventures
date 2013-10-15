var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable(db, 'user_review_table', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        user_id: { type: 'int', notNull: true },
        review_id: { type: 'int', notNull: true }
    });
};

exports.down = function(db, callback) {
    db.dropTable('user_review_table');
};
