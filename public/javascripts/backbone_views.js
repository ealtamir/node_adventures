define(['jquery-ui-1.10.3.min', 'underscore-min', 'backbone-min', 'app/constants'],
    function($, _, Backbone, c) {
        var SearchBar   = Backbone.View.extend({
            initialize: function(options) {
                $(options.el).autocomplete({
                    source: options.model.get('source'),
                });
                this.listenTo(options.model, 'change:source', this.render);
            },

            render: function() {
                var source = this.model.get('source');
                var minLength = 0;

                this.$el.autocomplete('option', 'source', source);

                minLength = (source.length >= c.MAX_SOURCE_SIZE)?
                    c.MIN_TEXT_SIZE: c.MAX_TEXT_SIZE;

                this.$el.autocomplete('option', 'minLength', minLength);
            },

            events: {
                "keyup": "handleKeyup",
            },

            handleKeyup: function(e) {
                var val = this.$el.val();

                this.model.set('field_text', val);

                if (val.length === 0) {
                    this.$el.autocomplete('disable');
                } else {
                    this.$el.autocomplete('enable');
                }

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

        return {
            SearchBar       : SearchBar,
            ReviewsModel    : ReviewsModel
        };
    }
);
