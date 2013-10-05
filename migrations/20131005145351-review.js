var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('review', {
        id: { type: 'int', primaryKey: 'true', autoIncrement: 'true'},
        positive: { type: 'int', defaultValue: 0, notNull: true },
        negative: { type: 'int', defaultValue: 0, notNull: true },
        comment: { type: 'string', length: '3000' },

        user_id: { type: 'int', notNull: true },
        professor_id: { type: 'int', notNull: true },
        score_id: { type: 'int', notNull: true },

        timestamp: { type: 'timestamp', notNull: true }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('review', callback);
};
