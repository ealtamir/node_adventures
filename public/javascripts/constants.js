define({
    MAX_SOURCE_SIZE  : 100,
    MIN_TEXT_SIZE    : 3,        // Min letters before ajax call
    MAX_TEXT_SIZE    : 0,        // Look in data even with 0 chars.

    STATE: {
        READY   : 'ready',
        ERROR   : 'error',
        BUSY    : 'busy'
    },
});
