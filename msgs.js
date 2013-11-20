exports.msg = (function() {
    var obj     = {},
        SUCCESS = 'successful',
        FAILURE = 'failure';

    obj.REGISTRATION_SUCCESS = {
        status: SUCCESS,
        msg: 'La registración se completó con éxito.'
    };

    obj.REGISTRATION_FAILURE = {
        status: FAILURE,
        msg: 'Ese nombre de usuario ya está registrado.'
    };

    obj.WRONG_USR_PWD = {
        status: FAILURE,
        msg: 'Tu nombre de usuario o contraseña fueron incorrectos.'
    };

    obj.LOGIN_SUCCESSFUL = {
        status: SUCCESS,
        msg: 'Pudiste ingresar con éxtio.'
    };

    obj.REVIEW_TEXT_ERR = function(type, length) {
        return {
            msg: 'El campo \'' + type + '\' no puede estar vacio ni tener más de ' +
                length + 'caracteres de largo.',
            status: FAILURE,
        };
    };

    obj.REVIEW_SCORE_ERR = function(type) {
        return {
            msg: 'El atributo \'' + type + '\' debe estar entre 0 y 5.',
            status: FAILURE
        };
    };

    return obj;
}());
