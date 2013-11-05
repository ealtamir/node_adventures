var crypto  = require('crypto');
var m       = require('./msgs').msg;

exports.check_valid     = check_valid;
exports.getTimestamp    = getTimestamp;
exports.listProps       = listProps;
exports.login_user      = login_user;
exports.sanitize        = sanitize;
exports.seed_encrypt    = seed_encrypt;
exports.set_flash       = set_flash;
exports.sym_encrypt     = sym_encrypt;
exports.sym_decrypt     = sym_decrypt;
exports.get_username    = get_username;


// Compile regex patterns once.
exports.regex = (function() {
    this.SANITIZE_PATTERN   = /[^0-9a-zA-Z@\-_\.\+ ]/g;
    this.SERVE_PROF         = /^([a-zA-Z]+-)*([a-zA-Z]+)$/;
    this.EMAIL_VALIDATOR    = /[\w-\.@]+@[\w-\.@]+\.[\w-\.@]{1,3}/;
    this.IS_HEX             = /^[0-9a-f]+$/i;

    return this;
}());

function listProps(obj) {
    var keys = [];

    for (var key in obj)
        keys.push(key);

    return keys;
}

function sanitize(str) {
    return str.replace(exports.regex.SANITIZE_PATTERN, '');
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
    req.session.user_id = sym_encrypt(
        username + '-' + req.app.get('salt')
    );
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
function sym_encrypt(str, app) {
    var cipher = crypto.createCipher(
        app.get('cipher_type'), app.get('session')
    );
    var encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}
function sym_decrypt(str, app) {
    if (exports.regex.IS_HEX.test(str)) {
        var decipher = crypto.createDecipher(
            app.get('cipher_type'), app.get('session')
        );
        var decrypted = decipher.update(str, 'hex', 'utf8');

        return decrypted + decipher.final('utf8');
    }

    return '';
}

function get_username(str, app) {
    var index = 0;

    str = sym_decrypt(str, app);
    if (!!str === true) {
        index = str.indexOf('-' + app.get('salt'));
        return index.splice(0, index);
    }
    return '';
}
