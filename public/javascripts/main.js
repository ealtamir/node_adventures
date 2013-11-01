requirejs.config({
    baseUrl: '/javascripts/lib',

    shim: {
        'jquery.min' : {
            exports : 'jQuery',
        },
        'backbone-min' : {
            deps    : ['jquery.min', 'underscore-min'],
            exports : 'Backbone'
        },

        'underscore-min' : {
            exports : '_'
        },

        'jquery-ui-1.10.3.min' : {
            deps    : ['jquery.min'],
            exports : 'jQuery'
        }
    },

    paths: {
        app: '..',
    }
});

requirejs(['app/index', 'app/constants', 'app/prof_view'], function(index, c, prof_view) {
    var url = window.location.pathname;

    index.initialize();
    if (c.P_VIEW_RGX.test(url)) {
        prof_view.initialize();
    }
});

