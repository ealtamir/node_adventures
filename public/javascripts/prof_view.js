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
        var reviewsModel = new models.ReviewsModel();

        var reviewFormView = new views.ReviewFormView({
            model   : reviewsModel,
            id      : 'review_form',
            el      : 'div#review_form'
        });

        var reviewsView = new views.ReviewContainerView({
            el          : 'div#reviews',
            collection  : new collections.ReviewsCollection(),
        });
    };
}
