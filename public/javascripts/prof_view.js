define(['jquery.min', 'underscore-min', 'backbone-min',
    'app/models', 'app/views', 'app/collections'],
    function($, _, Backbone, models, views, collections) {
        return {
            initialize: prof_view($, _, Backbone, models, views, collections),
        };
    }
);

function prof_view($, _, Backbone, models, views, collections) {
    return function() {
        var reviews_view = new views.ReviewContainerView({
            el          : 'div#reviews',
            collection  : new collections.ReviewsCollection(),
        });
    };
}
