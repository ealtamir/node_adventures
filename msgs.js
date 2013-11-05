exports.msg = (function() {
    var obj = {};

    obj.REGISTRATION_SUCCESS = {
        status: 'success',
        msg: 'La registración se completó con éxito.'
    };

    obj.REGISTRATION_FAILURE = {
        status: 'failure',
        msg: 'Ese nombre de usuario ya está registrado.'
    };

    obj.WRONG_USR_PWD = {
        status: 'failure',
        msg: 'Tu nombre de usuario o contraseña fueron incorrectos.'
    };

    obj.LOGIN_SUCCESSFUL = {
        status: 'successful',
        msg: 'Pudiste ingresar con éxtio.'
    };

    obj.REVIEW_TEXT_ERR = function(type, length) {
        return {
            msg: 'El campo \'' + type + '\' no puede estar vacio ni tener más de ' +
                length + 'caracteres de largo.',
            status: 'failure',
        };
    };

    obj.REVIEW_SCORE_ERR = function(type) {
        return {
            msg: 'El atributo \'' + type + '\' debe estar entre 0 y 5.',
            status: 'failure'
        };
    };

    return obj;
}());
