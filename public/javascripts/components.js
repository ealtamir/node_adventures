define(['jquery-ui-1.10.3.min', 'underscore-min', 'backbone-min',
       'app/models', 'app/constants', 'app/helpers', 'jquery.cookie'],
    function($, _, Backbone, models, c, helpers) {
        'use strict';

        // Add the pub/sub objects to the view objets
        var View = helpers.pubsub_view;

        var ViewWithForm = View.extend({
            startChecker: function(form, counter, max_chars) {
                var count = function() {
                    var txtVal = $(form).val(),
                        chars = txtVal.length;

                    $(counter).html(
                        '<span class="' +
                        ((chars > max_chars)? 'neg_num': '') + '">' +
                        chars + '</span> caracteres (' +
                        max_chars + ' máximo).'
                    );
                };
                count();
                $(form).on('keyup propertychange paste', function(){
                    count();
                });
            },

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
                this.pubSub.on(c.EVENT.REQUEST_AUTH,
                                 _.bind(this.hidePopover, this));

                var $login      = $('#bar_login_link'),
                    $register   = $('#bar_register_link'),
                    $log_popvr  = $('#bar_login_popover'),
                    $reg_popvr  = $('#bar_register_popover'),
                    $close      = $('#bar_auth_zone a.close');

                var click_action = function(e) {
                    e.preventDefault();
                    var target = e.target.id.split('_')[1];

                    if (target === 'login') {
                        $register.css('text-decoration', 'none');
                        $login.css('text-decoration', 'underline');
                        $log_popvr.removeClass('hide');
                        $reg_popvr.addClass('hide');
                    } else if (target === 'register') {
                        $login.css('text-decoration', 'none');
                        $register.css('text-decoration', 'underline');
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

                $close.click(_.bind(this.hidePopover, this));
            },
            hidePopover: function(e) {
                if (e !== undefined && e.target !== undefined) {
                    e.preventDefault();
                }
                $('.popover').addClass('hide');
                $('.header-links a').css('text-decoration', 'none');
            }
        });

        var SingleReviewView = View.extend({
            initialize: function(options) {
                this.model2 = options.model2;
                this.setStripe = options.attributes.setStripe;

                this.listenTo(this.model2, 'change:state',
                                 _.bind(this.updateVoteZone, this));
            },

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
                        size    : 16,
                        starHalf: 'star-half-small.png',
                        starOff : 'star-off-small.png',
                        starOn  : 'star-on-small.png',
                        readOnly: true,
                        score   : total,
                        click: function(score) {
                            view.trigger('change:score',
                                         $(this).attr('id'), score);
                        }
                    };
                }(this, attrs.total));

                $('#review_star_' + attrs.id).raty(stars_settings);

                this.setElement(id + ' div.review:first-child');
                // Not using events object
                this.$('a').click(_.bind(this.processVote, this));

                if (this.setStripe) {
                    this.$el.addClass('striped');
                }
            },

            processVote: function(e) {
                e.preventDefault();

                if ($.cookie('session') === undefined) {
                    this.pubSub.trigger(
                        c.EVENT.REQUEST_AUTH,
                        c.EVENT_MSGS.REQUEST_AUTH,
                        c.M_TYPES.INFORMATIVE
                    );
                    return;
                }

                var model           = this.model2,
                    target_class    = e.target.className;

                if (target_class.search('yes') === 0) {
                    model.set('positive', 1);
                } else if (target_class.search('no') === 0) {
                    model.set('negative', 1);
                } else {
                    return;
                }

                model.set('review_id', this.model.get('id'));
                model.sync();
            },

            updateVoteZone: function() {
                var state = this.model2.get('state');

                if (state === c.STATE.BUSY) {
                    return;
                }

                console.log('Vote updated!');
            }
        });

        var AuthFormView = ViewWithForm.extend({

            initialize: function() {
                this.listenTo(this.model, c.EVENT.AUTH_STATUS, this.authStatus);
            },

            events: {
                'click input.auth_submit' : 'requestAuth',
            },

            requestAuth: function(event) {
                event.preventDefault();
                console.log('requested!');

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

            authStatus: function(data) {
                var result = data.result;

                if (result.status === 'successful') {
                    this.pubSub.trigger(
                        c.EVENT.AUTH_SUCCESS,
                        c.EVENT_MSGS.AUTH_SUCCESS,
                        c.M_TYPES.SUCCESS
                    );
                } else if (result.status === 'failure') {
                    this.pubSub.trigger(
                        c.EVENT.AUTH_FAILURE,
                        result.msg,
                        c.M_TYPES.FAILURE
                    );
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
