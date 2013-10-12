
exports.listProps = function(obj) {
    var keys = [];

    for (var key in obj)
        keys.push(key);

    return keys;
};

exports.sanitize = function(str) {
    var pattern = /[^0-9a-zA-Z@\-_\.\+ ]/g;

    return str.replace(pattern, '');
};

exports.set_flash = function(obj, res) {
    res.cookie('flash', JSON.stringify(obj));
};

exports.check_valid = function() {
    var args = Array.prototype.slice.call(arguments);
    return args.every(function(x) { return !!x === true; });
};

exports.getTimestamp = function() {
    var d = new Date();
    var s = '';
    s += d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay();
    s += ' ';
    s += d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    console.log(s);

    return s;
};
