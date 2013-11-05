define(['jquery.min', 'underscore-min', 'backbone-min',
       'app/models', 'app/constants', 'app/helpers'],
    function($, _, Backbone, models, c, helpers) {
        var ReviewsCollection = Backbone.Collection.extend({

            model: models.ReviewsModel,

            url: '/reviews_query',

            start: (function() {

                var success = function(collection) {
                    return function(data, status, xhr) {
                        var reviews = data.data;

                        for (var i = 0, d = null; i < reviews.length; i++) {
                            d = reviews[i];

                            collection.add({
                                id          : d.id,
                                positive    : d.positive,
                                negative    : d.negative,
                                comment     : d.comment,
                                timestamp   : d.timestamp,

                                dinamica        : d.dinamica,
                                conocimientos   : d.conocimientos,
                                claridad        : d.claridad,
                                pasion          : d.pasion,
                                compromiso      : d.compromiso,
                                total           : d.total,
                            });
                        }
                        collection.trigger('change:state', c.STATE.READY);
                        collection.trigger('change:data', (reviews.length > 0)? true: false);
                    };
                };
                var error   = function(collection) {
                    return function(data, status, xhr) {
                        console.log('Error when initializing collection: ' + status);
                        collection.trigger('change:state', c.STATE.READY);
                    };
                };

                return function() {
                    this.trigger('change:state', c.STATE.BUSY);

                    $.ajax({
                        url         : this.url,
                        type        : 'get',
                        dataType    : 'json',
                        data        : { name: helpers.get_prof_name() },
                        success     : success(this),
                        error       : error(this)
                    });
                };
            }()),
        });

        return {
            ReviewsCollection   : ReviewsCollection,
        };
    }
);
