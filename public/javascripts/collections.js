define(['jquery.min', 'underscore-min', 'backbone-min',
       'app/backbone_models', 'app/constants'],
    function($, _, Backbone, models, c) {
        var ReviewsCollection = Backbone.Collection.extend({

            model: models.ReviewsModel,

            url: '/reviews_query',

            start: (function() {

                var success = function(collection) {
                    return function(data, status, xhr) {
                        for (var i = 0, d = null; i < data.length; i++) {
                            d = data[i];

                            collection.add({
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
                        collection.trigger('change:data', (data.length > 0)? true: false);
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
                        data        : { name: 'Carlos', last_name: 'Example' },
                        success      : success(this),
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
