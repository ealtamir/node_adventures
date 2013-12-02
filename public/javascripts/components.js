define(['jquery-ui-1.10.3.min', 'underscore-min', 'backbone-min',
       'app/models', 'app/constants', 'app/helpers'],
    function($, _, Backbone, models, c, helpers) {
        'use strict';

        // Add the pub/sub objects to the view objets
        var View = helpers.pubsub_view;

        var ViewWithForm = View.extend({

            checkSize: function() {

            },

            checkValid: function() {

            },
        });


        var AuthPopoverView = View.extend({
            initialize: function() {
                // TODO: Check if session cookie exists, if so update bar
                this.pubSub.once(c.EVENT.AUTH_SUCCESS,
                                 _.bind(this.hidePopover, this));
                this.pubSub.once(c.EVENT.AUTH_REQUESTED,
                                 _.bind(this.hidePopover, this));

                var $login      = $('#bar_login_link'),
                    $register   = $('#bar_register_link'),
                    $log_popvr  = $('#bar_login_popover'),
                    $reg_popvr  = $('#bar_register_popover');

                var click_action = function(e) {
                    e.preventDefault();
                    var target = e.target.id.split('_')[1];

                    if (target === 'login') {
                        $log_popvr.removeClass('hide');
                        $reg_popvr.addClass('hide');
                    } else if (target === 'register') {
                        $log_popvr.addClass('hide');
                        $reg_popvr.removeClass('hide');
                    }
                };

                $login.click(click_action);
                $register.click(click_action);

                this.login_form = new AuthFormView({
                    id      : 'bar_login_popover',
                    el      : 'div#bar_login_popover',
                    model   : new models.AuthDataModel({
                        url: '/login'
                    }),
                });
                this.register_form = new AuthFormView({
                    id      : 'bar_register_popover',
                    el      : 'div#bar_register_popover',
                    model   : new models.AuthDataModel({
                        url: '/ajax_register'
                    }),
                });
            },
            hidePopover: function() {
                this.$('.popover').addClass('hide');
            }
        });

        var SingleReviewView = View.extend({
            render: function(id) {
                var template    = _.template(
                        $(this.attributes.template_name).html()
                    ),
                    total       = 0,
                    attrs       = this.model.attributes,
                    vals        = null;

                // Calculate total score
                vals = _.values(attrs.score);

                for (var i = 0; i < vals.length; i += 1) {
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
                        click: function(score) {
                            view.trigger('change:score',
                                         $(this).attr('id'), score);
                        }
                    };
                }(this, attrs.total));


                $('#review_star_' + attrs.id).raty(stars_settings);
            },
        });

        var AuthFormView = ViewWithForm.extend({

            initialize: function() {
                this.listenTo(this.model, 'change:state', this.stateChange);
                this.listenTo(this.model, c.EVENT.AUTH_STATUS, this.authStatus);
                this.$('input.auth_submit').click(function(e) {
                    e.preventDefault();
                    console.log('do some crazy shit man');
                });
            },

            events: {
                'click input.auth_submit' : 'requestAuth',
            },

            requestAuth: function(event) {
                event.preventDefault();
                console.log('requested!');
                this.pubSub.trigger(c.EVENT.AUTH_REQUESTED);

                if (this.model.get('state') === c.STATE.READY) {
                    var $username   = this.$('input.username'),
                        $password   = this.$('input.password'),
                        $email      = this.$('input.email');

                    this.model.set('username', $username.val());
                    this.model.set('password', $password.val());
                    this.model.set('email', $email.val());

                    this.model.sync();
                }
            },

            stateChange: function() {

            },

            authStatus: function(data) {
                var result = data.result;
                console.dir(data);

                if (result.status === 'successful') {
                    this.pubSub.trigger(c.EVENT.AUTH_SUCCESS);
                } else if (result.status === 'failure') {
                    this.pubSub.trigger(c.EVENT.AUTH_FAILURE);
                }
            }
        });

        return {
            SingleReviewView    : SingleReviewView,
            AuthPopoverView     : AuthPopoverView,
            AuthFormView        : AuthFormView,
            ViewWithForm        : ViewWithForm,
        };
    }
);
