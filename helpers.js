var crypto      = require('crypto');

var m           = require('./msgs').msg;

exports.check_valid     = check_valid;
exports.getTimestamp    = getTimestamp;
exports.listProps       = listProps;
exports.login_user      = login_user;
exports.sanitize        = sanitize;
exports.seed_encrypt    = seed_encrypt;
exports.set_flash       = set_flash;

function listProps(obj) {
    var keys = [];

    for (var key in obj)
        keys.push(key);

    return keys;
}

function sanitize(str) {
    var pattern = /[^0-9a-zA-Z@\-_\.\+ ]/g;

    return str.replace(pattern, '');
}

function set_flash(obj, res) {
    res.cookie('flash', JSON.stringify(obj));
}

function check_valid() {
    var args = Array.prototype.slice.call(arguments);
    return args.every(function(x) { return !!x === true; });
}

function getTimestamp(t_stamp) {
    var d = null;

    if (t_stamp !== undefined) {
        d = new Date(t_stamp);
    } else {
        d = new Date();
    }

    var s = '';
    s += d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getUTCDate();
    s += ' ';
    s += d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

    return s;
}

function login_user(username, req, res) {
    req.session.user_id = username + '_id';
    exports.set_flash(m.LOGIN_SUCCESSFUL, res);
}

function seed_encrypt(str, add_seed, app) {

    var hash = null;

    hash1 = crypto.createHash(app.get('hash_type'));
    hash2 = crypto.createHash(app.get('hash_type'));

    hash1.update(str + add_seed, 'unicode');
    str = hash1.digest('hex');

    hash2.update(str + app.get('seed'), 'unicode');
    str = hash2.digest('hex');

    return str;
}
