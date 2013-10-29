var SingleReviewView = Backbone.View.extend({

    tagName: 'div',

    className: 'review pure-offset-1-12 pure-u-10-12',

    initialize: function() {

    },

    render: function() {

    },

    events: {

    },
});
var ReviewsModel = Backbone.Model.extend({
    defaults: {
        positive    : 0,
        negative    : 0,
        comment     : 'default comment',
        timestamp   : 'never',

        dinamica        : 0,
        conocimientos   : 0,
        claridad        : 0,
        pasion          : 0,
        compromiso      : 0,
        total           : 0
    },

    initialize: function() {
    },
});

var ReviewContainerView = Backbone.View.extend({

});
var ReviewsCollection = Backbone.Model.extend({

    model: ReviewsModel,

    initialize: function() {

    },
});
