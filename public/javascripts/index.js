window.MAX_SOURCE_SIZE  = 100;
window.MIN_TEXT_SIZE    = 3;        // Min letters before ajax call
window.MAX_TEXT_SIZE    = 0;        // Look in data even with 0 chars.

var Autocomplete = Backbone.Model.extend({
    defaults: function() {
        return {
            'field_text'    : '',
            'last_text'     : '',
            'example_data'  : [
                { label: "anders", category: "" },
                { label: "andreas", category: "" },
                { label: "antal", category: "" },
                { label: "annhhx10", category: "Products" },
                { label: "annk K12", category: "Products" },
                { label: "annttop C13", category: "Products" },
                { label: "anders andersson", category: "People" },
                { label: "andreas andersson", category: "People" },
                { label: "andreas johnson", category: "People" },
            ],
            'source'        : [],
        };
    },

    initialize: function() {
        this.on('change:field_text', this.sync);
    },

    sync: function() {
        var text = this.get('field_text');

        if (text !== this.get('last_text') &&
            text.length <= MIN_TEXT_SIZE) {
            // get data from server.
            this.set('source', this.get('example_data'));
            this.set('last_text', text);
        }
    }
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
        this.model.set('field_text', this.$el.val());
    },
});

var index_sb_model    = new  Autocomplete();
var index_search_bar  = new SearchBar({
    el: 'input#main_sfield',
    id: 'main_sfield',
    container: '#auto-complete',
    model: index_sb_model,
});
