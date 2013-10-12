var SearchBar = Backbone.View.extend({

    render: function() {
    },

    events: {
        "keypress": "handleKeypress",
    },

    handleKeypress: function(event) {
        console.log('Key was clicked');
        console.log(event);
    },
});

var search_bar = new SearchBar({
    el: 'input#main_sfield',
    id: 'main_sfield',
});

console.log(search_bar);
