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
        REVIEW_SUBMITTED    : 'review_submitted',
        AUTH_SUCCESS        : 'auth_success',
        REQUEST_AUTH        : 'request_auth',
        AUTH_STATUS         : 'auth_status',
        AUTH_REQUESTED      : 'auth_requested',
    }
});
