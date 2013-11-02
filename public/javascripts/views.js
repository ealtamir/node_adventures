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

        var SingleReviewView = Backbone.View.extend({

            initialize: function(options) {
            },

            render: function(id) {
                var template = _.template($(this.attributes.template_name).html());
                template = template(this.model.attributes);
                console.log(template);

                $(id).append(template);
            },

            events: {

            },
        });

        var ReviewContainerView = Backbone.View.extend({
            initialize: function() {
                this.nestedViews = [];

                this.listenTo(this.collection, 'change:state', this.stateChange);
                this.listenTo(this.collection, 'add', this.newReview(this));

                this.collection.once('change:data', _.bind(this.showResults, this));

                this.collection.start();
            },

            newReview: function(view) {
                return function(model) {
                    console.log('view added');

                    $(view.id + ' #reviews_found').removeClass('hide');
                    var newView = new SingleReviewView({
                        model       : model,
                        attributes  : {
                            template_name : '#review_template',
                        }
                    });

                    view.nestedViews.push(newView);
                    newView.render('#reviews_found');
                };
            },

            render: function() {

            },

            stateChange: function(state) {

                if (state === c.STATE.BUSY) {
                    $('#waiting_msg').removeClass('hide');
                    $('#reviews').addClass('hide');
                } else if (state === c.STATE.READY) {
                    $('#waiting_msg').addClass('hide');
                    $('#reviews').removeClass('hide');
                }
            },

            showResults: function(resultsFound) {
                var id = '#' + this.$el.attr('id');

                if (resultsFound) {
                    $('#reviews_found').removeClass('hide');
                } else {
                    $('#no_reviews_msg').removeClass('hide');
                }
            }
        });

        return {
            SearchBar           : SearchBar,
            SingleReviewView    : SingleReviewView,
            ReviewContainerView : ReviewContainerView
        };
    }
);
