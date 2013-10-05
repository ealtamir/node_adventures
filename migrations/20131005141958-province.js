var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable('province', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        name: { type: 'string', length: 64 },
        name_of_capital: { type: 'string', length: '128' }
    }, callback);

};

exports.down = function(db, callback) {
    db.dropTable('province', callback);
};
