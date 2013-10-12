

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

    return obj;

}());
