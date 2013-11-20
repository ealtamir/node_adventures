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
        var reviewsModel = new models.ReviewsModel({
            url     : '/submit_review',
        });

        var reviewCollection = new collections.ReviewsCollection();

        var reviewsView = new views.ReviewContainerView({
            el          : 'div#reviews',
            collection  : reviewCollection,
        });

        var reviewFormView = new views.ReviewFormView({
            model       : reviewsModel,
            id          : 'review_form',
            el          : 'div#review_form',
            collection  : reviewCollection,
        });

        var authRequestView = new views.AuthRequestView({
            id  : 'auth_form',
            el  : 'div#auth_form'
        });

        var ProfessorProfileView = new views.ProfessorProfileView({
            id : 'professor_profile',
            el : 'div#professor_profile'
        });

    };
}
