define(['jquery-ui-1.10.3.min', 'underscore-min', 'backbone-min', 'app/models',
       'app/constants', 'app/components', 'app/helpers', 'jquery.cookie'],
    function($, _, Backbone, models, c, comps, helpers) {
        'use strict';

        // Add the pub/sub objects to the view objets
        var View = helpers.pubsub_view;

        var SearchBar   = comps.ViewWithForm.extend({
            initialize: function(options) {
                if ($.cookie('session') === undefined) {
                    this.pubSub.listenTo(this.pubSub, c.EVENT.AUTH_SUCCESS,
                                        _.bind(this.refreshBarAuthZone, this));
                    this.listenTo(options.model, 'change:source', this.render);

                } else {
                    this.refreshBarAuthZone();
                }

                $(options.el).autocomplete({
                    source: options.model.get('source'),
                });
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
                'keyup': 'handleKeyup',
            },

            handleKeyup: function() {
                var val = this.$el.val();

                this.model.set('field_text', val);

                if (val.length === 0) {
                    this.$el.autocomplete('disable');
                } else {
                    this.$el.autocomplete('enable');
                }

            },

            // For when user logs in or registers.
            refreshBarAuthZone: function() {
                $('#logged_in').removeClass('hide');
                $('#bar_auth_zone').addClass('hide');
            }
        });
        var ProfessorProfileView = View.extend({
            initialize: function() {
                var total = 0;
                this.pubSub.once(c.EVENT.REVIEW_SUBMITTED,
                                 _.bind(this.addBottomBorder, this));

                _.each(c.ATTRIBUTES, function(el) {
                    total += parseInt($('#score_' + el).attr('data-score'), 10);
                });
                total = total / c.ATTRIBUTES.length;
                $('#total_score').attr('data-score', total);
            },
            addBottomBorder: function() {
                this.$el.addClass('bottom_border');
            }
        });

        var ReviewContainerView = View.extend({
            initialize: function() {
                this.nestedViews = [];

                this.listenTo(this.collection,
                              'change:state', this.stateChange);
                this.listenTo(this.collection,
                              'add', this.newReview(this));

                this.collection.once('change:data',
                                     _.bind(this.showResults, this));

                this.collection.start();
            },

            newReview: function(view) {
                return function(model) {

                    $(view.id + ' #reviews_found').removeClass('hide');
                    var newView = new comps.SingleReviewView({
                        model       : model,
                        model2      : new models.ReviewVotesModel({
                            url : '/vote'
                        }),
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
                if (resultsFound) {
                    $('#reviews_found').removeClass('hide');
                } else {
                    $('#no_reviews_msg').removeClass('hide');
                }
            }
        });

        var ReviewFormView = comps.ViewWithForm.extend({

            initialize: function() {
                this.listenTo(this, 'change:score', this.updateScore);
                this.listenTo(this.model, 'change:state', this.stateChange);
                this.pubSub.once(c.EVENT.REVIEW_SUBMITTED,
                                 _.bind(this.hideView, this));

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
                        click: function(score) {
                            view.trigger('change:score',
                                         $(this).attr('id'), score);
                        }
                    };
                }(this));

                $('#total_score').raty(stars_settings);

                // Set prof profile and review form stars.
                _.each(c.ATTRIBUTES, function(el) {
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

            hideView: function() {
                this.$el.addClass('hide');
                $('#calificar_button').addClass('hide');
            },

            sendRequest: function() {
                if (this.model.get('state') === c.STATE.READY) {
                    this.model.sync();
                }
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

                this.model.set(type, $form.val());
            },

            stateChange: function(e, state, data) {
                if (state === c.STATE.READY) {
                    if (data.loose === true) {
                        this.$el.addClass('hide');
                        this.pubSub.once(c.EVENT.AUTH_SUCCESS,
                                         _.bind(this.addReview, this));
                        this.pubSub.trigger(c.EVENT.REQUEST_AUTH);
                    } else {
                        this.addReview();
                    }
                }
            },
            addReview: function() {
                this.collection.add(this.model);
                this.pubSub.trigger(c.EVENT.REVIEW_SUBMITTED);
            }
        });

        var AuthRequestView = View.extend({

            initialize: function() {
                this.listenTo(this.pubSub,
                              c.EVENT.REQUEST_AUTH, this.setupAuth);
                this.pubSub.once(c.EVENT.AUTH_SUCCESS,
                                 this.authCompleted(this));
            },

            authCompleted: function(view) {
                return function() {
                    view.$el.addClass('hide');
                };
            },

            setupAuth: function() {
                this.$el.removeClass('hide');

                this.register_form = new comps.AuthFormView({
                    id      : 'auth_reg_form',
                    el      : 'div#auth_reg_form',
                    model   : new models.AuthDataModel({
                        url: '/ajax_register'
                    }),
                });
                this.login_form = new comps.AuthFormView({
                    id      : 'auth_log_form',
                    el      : 'div#auth_log_form',
                    model   : new models.AuthDataModel({
                        url: '/login'
                    }),
                });
            },
        });


        return {
            SearchBar           : SearchBar,
            ReviewContainerView : ReviewContainerView,
            ReviewFormView      : ReviewFormView,
            AuthRequestView     : AuthRequestView,
            ProfessorProfileView: ProfessorProfileView
        };
    }
);
