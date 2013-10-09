
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
