define(['jquery-ui-1.10.3.min', 'underscore-min', 'backbone-min', 'app/constants'],
    function($, _, Backbone, c) {
        var ViewWithForm = Backbone.View.extend({

            checkSize: function() {

            },

            checkValid: function() {

            },
        });
        var SearchBar   = ViewWithForm.extend({
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

                $(id).prepend(template);
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

        var ReviewFormView = ViewWithForm.extend({

            initialize: function() {
                this.listenTo(this, 'change:score', this.updateScore);
                this.listenTo(this.model, 'change:state', this.stateChange);

                this.model.set('comment', $('#review_comment').val());
                this.model.set('advice', $('#review_advice').val());

                var stars_settings = (function(view) {
                    return {
                        half    : false,
                        path    : '/img/',
                        size    : 24,
                        starHalf: 'star-half-big.png',
                        starOff : 'star-off-big.png',
                        starOn  : 'star-on-big.png',
                        readOnly: true,
                        score   : function() {
                            return $(this).attr('data-score');
                        },
                        click: function(score, evt) {
                            view.trigger('change:score', $(this).attr('id'), score);
                        }
                    };
                }(this));

                $('#total_score').raty(stars_settings);

                // Set prof profile and review form stars.
                _.each(c.ATTRIBUTES, function(el, index, list) {
                    $('#score_' + el).raty(stars_settings);

                    stars_settings.readOnly = false;

                    // read only to show professor score.
                    $('#star_' + el).raty(stars_settings);

                    stars_settings.readOnly = true;
                });

                $('#calificar_button').click(function() {
                    $('#review_form').removeClass('hide');
                    $('#' + this.id).addClass('hide');
                    $('#professor_profile').removeClass('bottom_border');
                });

                $('#cancel_review').click(function() {
                    $('#review_form').addClass('hide');
                    $('#professor_profile').addClass('bottom_border');
                    $('#calificar_button').removeClass('hide');
                });
            },

            events: {
                'click #commit_review'      : 'sendRequest',
                'focusout #review_comment'  : 'updateComments',
                'focusout #review_advice'   : 'updateComments',
            },

            sendRequest: function() {
                this.model.sync();
            },

            updateScore: function(id, score) {
                // Gets dinamica or compromiso or pasion, etc...
                var category = id.split('_')[1];

                // gets the 'score' object that holds each category.
                this.model.get('score')[category] = score;
            },

            updateComments: function(event) {
                var $form   = $(event.currentTarget), // before id
                    id      = $form.attr('id'),
                    type    = id.split('_')[1]; // comment or advice

                console.log(type + ' ' + id);

                this.model.set(type, $form.val());
            },

            stateChange: function(e, state, data) {
                console.log(state);
                console.log(data);
                if (state === c.STATE.READY) {
                    if (data.loose === true) {
                        this.requestAuth();
                    } else {
                        this.collection.add(this.model);
                        console.log('add review');
                    }
                }
            },

            requestAuth: function() {
                var $review_form    = $('#review_form'),
                    $auth_form      = $('#auth_form');


                    $auth_form.removeClass('hide');
                    $review_form.addClass('hide');
            },


        });

        return {
            SearchBar           : SearchBar,
            SingleReviewView    : SingleReviewView,
            ReviewContainerView : ReviewContainerView,
            ReviewFormView      : ReviewFormView
        };
    }
);
