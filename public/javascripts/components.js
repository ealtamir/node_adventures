define(['jquery-ui-1.10.3.min', 'underscore-min', 'backbone-min',
       'app/models', 'app/constants', 'app/helpers'],
    function($, _, Backbone, models, c, helpers) {

        // Add the pub/sub objects to the view objets
        var View = helpers.pubsub_view;

        var SingleReviewView = View.extend({
            render: function(id) {
                var template    = _.template($(this.attributes.template_name).html()),
                    total       = 0,
                    attrs       = this.model.attributes;
                    vals        = null;


                // Calculate total score
                vals = _.values(attrs.score);

                for (var i = 0; i < vals.length; i++) {
                    total += parseInt(vals[i], 10);
                }

                attrs.total = total / vals.length;
                template = template(attrs);

                $(id).prepend(template);

                var stars_settings = (function(view, total) {
                    return {
                        half    : true,
                        path    : '/img/',
                        size    : 24,
                        starHalf: 'star-half-big.png',
                        starOff : 'star-off-big.png',
                        starOn  : 'star-on-big.png',
                        readOnly: true,
                        score   : total,
                        click: function(score, evt) {
                            view.trigger('change:score', $(this).attr('id'), score);
                        }
                    };
                }(this, attrs.total));


                $('#review_star_' + attrs.id).raty(stars_settings);
            },
        });

        return {
            SingleReviewView : SingleReviewView,
        };
    }
);
