define(['jquery.min', 'underscore-min', 'backbone-min'],
    function($, _, Backbone) {
        var ReviewsCollection = Backbone.Model.extend({

            model: ReviewsModel,

            initialize: function() {

            },
        });

        return {
            ReviewsCollection   : ReviewsCollection,
        };
    }
);
