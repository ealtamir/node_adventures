define(['jquery.min', 'underscore-min', 'backbone-min',
    'app/models', 'app/views', 'app/collections', 'jquery.raty.min'],
    function($, _, Backbone, models, views, collections) {
        return {
            initialize: prof_view($, _, Backbone, models, views, collections),
        };
    }
);

function prof_view($, _, Backbone, models, views, collections) {
    return function() {
        var stars_settings = {
            half    : true,
            path    : '/img/',
            size    : 24,
            starHalf: 'star-half-big.png',
            starOff : 'star-off-big.png',
            starOn  : 'star-on-big.png',
        };

        $('#star_dinamica').raty(stars_settings);
        $('#star_conocimientos').raty(stars_settings);
        $('#star_claridad').raty(stars_settings);
        $('#star_pasion').raty(stars_settings);
        $('#star_compromiso').raty(stars_settings);
        $('#star_exigencia').raty(stars_settings);

        var reviews_view = new views.ReviewContainerView({
            el          : 'div#reviews',
            collection  : new collections.ReviewsCollection(),
        });
    };
}
