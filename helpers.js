

exports.listProps = function(obj) {
    var keys = [];

    for (var key in obj)
        keys.push(key);

    return keys;
};

exports.sanitize = function(str) {
    var pattern = /[^0-9a-zA-Z@\-_\.\+]/g;

    return str.replace(pattern, '');
};

//exports.AsyncTools = (function() {
//    var module = {};
//
//    module.series = function(arr, callback) {
//        if (arr.length === 0)
//            return callback(null);
//
//        callback = callback || function () {};
//
//        var results = [];
//        var completed = 0;
//        var iterate = function() {
//            arr[completed](function(err, result) {
//                if (err) {
//                    callback(err);
//                } else {
//                    if (result) results.push(result);
//
//                    completed++;
//                    if (completed < arr.length) {
//                        iterate();
//                    } else {
//                        callback(null, results);
//                    }
//                }
//            });
//        };
//
//        iterate();
//    };
//
//    module.series = function(callbacks, last) {
//        var results = [];
//
//        function next() {
//            var callback = callbacks.shift();
//
//            if(callback) {
//                callback(function() {
//                    results.push(Array.prototype.slice.call(arguments));
//                    next();
//                });
//            } else {
//                last(results);
//            }
//        }
//
//        next();
//    };
//
//    return module;
//
//}());
