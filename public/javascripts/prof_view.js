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
            readOnly: true,
            score  : function() {
                return $(this).attr('data-score');
            }
        };


        $('#total_score').raty(stars_settings);

        $('#score_dinamica').raty(stars_settings);
        $('#score_conocimientos').raty(stars_settings);
        $('#score_claridad').raty(stars_settings);
        $('#score_pasion').raty(stars_settings);
        $('#score_compromiso').raty(stars_settings);
        $('#score_exigencia').raty(stars_settings);

        stars_settings.readOnly = false; // Because these are used to review the prof.
        $('#star_dinamica').raty(stars_settings);
        $('#star_conocimientos').raty(stars_settings);
        $('#star_claridad').raty(stars_settings);
        $('#star_pasion').raty(stars_settings);
        $('#star_compromiso').raty(stars_settings);
        $('#star_exigencia').raty(stars_settings);

        $('#calificar_button').click(function() {
            $('#review_form').removeClass('hide');
            $('#' + this.id).addClass('hide');
            $('#professor_profile').removeClass('bottom_border');
        });
        $('#cancel_review').click(function() {
            $('#review_form').addClass('hide');
            $('#professor_profile').addClass('bottom_border');
            $('#calificar_button').removeClass('hide');
        });

        var reviews_view = new views.ReviewContainerView({
            el          : 'div#reviews',
            collection  : new collections.ReviewsCollection(),
        });
    };
}
