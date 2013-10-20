
var DataSource = Backbone.Model.extend({
    defaults: (function() {
        return {
            'field_text'    : '',
            'last_text'     : '',
            'source'        : [],
            'url'           : '',
            'state'         : 'ready'
        };
    }()),

    initialize: function() {
        this.on('change:field_text', this.sync);
        console.log(this.defaults);
    },

    sync: (function() {
        var success = function(model) {
            return function(data, status, xhr) {
                console.log('ajax call got success: ');
                console.log(data);

                if (!!data.data === true)
                    model.set('source', process_data(data.data));

                model.set('state', STATE.READY);
            };
        };
        var error   = function(model) {
            return function(xhr, status, err) {
                console.log('ajax call got error: ' + err);
                model.set('state', STATE.READY);
            };
        };
        return function() {
            var text = this.get('field_text');

            if (text !== this.get('last_text') &&
                text.length === MIN_TEXT_SIZE) {
                // get data from server.
                // this.set('source', this.get('example_data'));
                this.set('last_text', text);
                this.set('state', STATE.BUSY);

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

        minLength = (source.length >= MAX_SOURCE_SIZE)?
            MIN_TEXT_SIZE: MAX_TEXT_SIZE;

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

(function (scoper) {
    scoper(jQuery, window, document);
}(function($, window, document) {
    window.MAX_SOURCE_SIZE  = 100;
    window.MIN_TEXT_SIZE    = 3;        // Min letters before ajax call
    window.MAX_TEXT_SIZE    = 0;        // Look in data even with 0 chars.
    window.STATE            = {
        READY   : 'ready',
        ERROR   : 'error',
        BUSY    : 'busy'
    };

    $(function() {
        var index_sb_model    = new  DataSource({
            url: '/prof_query',
        });
        var index_search_bar  = new SearchBar({
            el: 'input#main_sfield',
            id: 'main_sfield',
            container: '#auto-complete',
            model: index_sb_model,
        });
    });
}));

function process_data(data) {
    var autocom_rows = [];

    if (data instanceof Array) {
        data.forEach(function(row, i, arr) {
            autocom_rows.push({
                label : row.name
            });
        });
    }

    return autocom_rows;
}
