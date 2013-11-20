define(['jquery.min', 'underscore-min', 'backbone-min',
       'app/constants', 'app/helpers'],
    function($, _, Backbone, c, helpers) {
        var DataSource = Backbone.Model.extend({
            defaults: (function() {
                return {
                    'field_text'    : '',
                    'last_text'     : '',
                    'source'        : [],
                    'url'           : '',
                    'state'         : c.STATE.READY
                };
            }()),

            initialize: function() {
                this.on('change:field_text', this.sync);
            },

            sync: (function() {
                var success = function(model) {
                    return function(data, status, xhr) {
                        console.log('ajax call got success: ');
                        console.log(data);

                        if (!!data.data === true)
                            model.set('source', helpers.process_data(data.data));

                        model.set('state', c.STATE.READY);
                    };
                };
                var error   = function(model) {
                    return function(xhr, status, err) {
                        console.log('ajax call got error: ' + err);
                        model.set('state', c.STATE.READY);
                    };
                };
                return function() {
                    var text = this.get('field_text');

                    if (text !== this.get('last_text') &&
                        text.length === c.MIN_TEXT_SIZE) {
                        // get data from server.
                        // this.set('source', this.get('example_data'));
                        this.set('last_text', text);
                        this.set('state', c.STATE.BUSY);

                        return $.ajax({
                            url         : this.get('url'),
                            type        : 'get',
                            dataType    : 'json',
                            data        : { q: text },
                            success     : success(this),
                            error       : error(this)
                        });
                    }
                };
            }())
        });

        var ReviewsModel = Backbone.Model.extend({
            defaults : {
                id          : 0,
                positive    : 0,
                negative    : 0,
                comment     : '',
                advice      : '',
                timestamp   : helpers.getTimestamp(),

                score       : {
                    dinamica        : 0,
                    conocimientos   : 0,
                    claridad        : 0,
                    pasion          : 0,
                    compromiso      : 0,
                    exigencia       : 0,
                },
                total   : 0,
                state   : c.STATE.READY,
            },

            sync: (function() {
                var success = function(model) {
                    return function(data, status, xhr) {
                        model.set('state', c.STATE.READY, data);
                        console.log('Review Form sync succeeded.');
                    };
                };

                var error = function(model) {
                    return function(xhr, status, err) {
                        model.set('state', c.STATE.READY);
                        console.log(status + ' ' + err);
                    };
                };

                return function() {
                    if (!this.attrAreValid)
                        return false;

                    if (this.get('state') === c.STATE.BUSY)
                        return false;

                    this.set('state', c.STATE.BUSY);
                    this.attributes.prof_name = helpers.get_prof_name();

                    $.ajax({
                        url         : this.get('url'),
                        type        : 'post',
                        dataType    : 'json',
                        data        : this.attributes,
                        success     : success(this),
                        error       : error(this)
                    });
                };
            }()),

            attrAreValid: function() {
                var attr = this.attributes;

                _.each(attr, function(val, key, list) {
                    if (!!val === false)
                        return false;
                    if (key === 'comment' && !!val === false)
                        return false;
                    if (_.contains(c.ATTRIBUTES, key) && val > 5 || val < 0)
                        return false;
                });

                return true;
            },
        });

        var AuthDataModel = Backbone.Model.extend({
            defaults: {
                username : '',
                password : '',
                email    : '',
                state    : c.STATE.READY,
            },
            sync: (function() {
                var success = function(model) {
                    return function(data, status, xhr) {
                        model.set('state', c.STATE.READY);
                        model.trigger('auth_status', data);
                    };
                };

                var error = function(model) {
                    return function(xhr, status, err) {
                        model.set('state', c.STATE.READY);
                        model.trigger('auth_status', status);
                    };
                };
                return function() {
                    this.set('state', c.STATE.BUSY);

                    $.ajax({
                        url         : this.get('url'),
                        type        : 'post',
                        dataType    : 'json',
                        data        : this.attributes,
                        success     : success(this),
                        error       : error(this)
                    });
                };
            }()),
        });

        return {
            ReviewsModel    : ReviewsModel,
            DataSource      : DataSource,
            AuthDataModel   : AuthDataModel,
        };
    }
);
