var crypto  = require('crypto'),
    m       = require('./msgs').msg,
    _       = require('underscore');

exports.check_valid     = check_valid;
exports.custom_render   = custom_render;
exports.getTimestamp    = getTimestamp;
exports.get_username    = get_username;
exports.listProps       = listProps;
exports.login_user      = login_user;
exports.sanitize        = sanitize;
exports.seed_encrypt    = seed_encrypt;
exports.set_flash       = set_flash;
exports.sym_decrypt     = sym_decrypt;
exports.sym_encrypt     = sym_encrypt;


// Compile regex patterns once.
exports.regex = (function() {
    this.EMAIL_VALIDATOR    = /[\w-\.@]+@[\w-\.@]+\.[\w-\.@]{1,3}/;
    this.IS_HEX             = /^[0-9a-f]+$/i;
    this.SANITIZE_PATTERN   = /[^0-9a-zA-Z@\-_\.\+ ]/g;
    this.SANITIZE_SCORE     = /^(?:[0-9]+,)*(?:[0-9])$/;
    this.SERVE_PROF         = /^([a-zA-Z]+-)*([a-zA-Z]+)$/;

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
    var value = sym_encrypt(
        username + '-' + req.app.get('salt'),
        req.app
    );
    res.cookie('session', value, {
        path    : '/',
        expires : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    });
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

function get_username(req) {
    var index   = 0,
        str     = req.cookies.session,
        app     = req.app;

    str = sym_decrypt(str, app);
    if (!!str === true) {
        index = str.indexOf('-' + app.get('salt'));
        return str.slice(0, index);
    }
    return '';
}

function custom_render(res, req, view, params) {
    return res.render(view, _.extend(params, { STATE: req.state }));
}
