
exports.up = function(db, callback) {
    'use strict';
    db.createTable('vote_user_table', {
        id: { type: 'int', primaryKey: 'true', autoIncrement: 'true'},
        review_id: { type: 'int', notNull: true },
        user_id: { type: 'int', notNull: true },
        positive: { type: 'int', defaultValue: 0 },
        negative: { type: 'int', defaultValue: 0 },
    }, callback);

};

exports.down = function(db, callback) {
    'use strict';
    db.dropTable('vote_user_table', callback);
};
