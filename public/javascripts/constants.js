define({
    MAX_SOURCE_SIZE  : 100,
    MIN_TEXT_SIZE    : 3,        // Min letters before ajax call
    MAX_TEXT_SIZE    : 0,        // Look in data even with 0 chars.

    STATE : {
        READY   : 'ready',
        ERROR   : 'error',
        BUSY    : 'busy'
    },
    P_VIEW_RGX          : /\/profesor\/(?:[a-zA-Z]+-)*(?:[a-zA-Z]+)\/?$/,
    P_VIEW_REVIEWS_RGX  : /\/profesor\/((?:[a-zA-Z]+-)*(?:[a-zA-Z]+))\/?/,

    ATTRIBUTES          :  ['dinamica', 'conocimientos',
        'claridad', 'pasion', 'compromiso', 'exigencia'],

    EVENT: {
        AUTH_FAILURE        : 'auth_failure',
        AUTH_STATUS         : 'auth_status',
        AUTH_SUCCESS        : 'auth_success',
        AUTH_FOR_SUBMIT     : 'auth_for_submit',
        REQUEST_AUTH        : 'request_auth',
        REVIEW_SUBMITTED    : 'review_submitted',
        REVIEW_INPUT_ERROR  : 'review_input_error',
    },
    M_TYPES: {
        INFORMATIVE     : 'informative',
        SUCCESS         : 'success',
        FAILURE         : 'failure',
    },
    EVENT_MSGS: {
        REVIEW_INPUT_ERROR  : 'No se pudo enviar la calificación. Por favor, ' +
            'revisa que no hayas excedido el límite de palabras y que hayas ' +
            'elegido una calificación para cada criterio.',
        REQUEST_AUTH        : 'Debes ingresar o registrarte antes de poder ' +
            'completar esa acción.',
        AUTH_SUCCESS        : 'Pudiste ingresar con éxito.',
        AUTH_FAILURE        : 'Hubo un error con la registración. Por favor ' +
            'vuelve a intentarlo.',
    }
});
