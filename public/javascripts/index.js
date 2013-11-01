define(['jquery.min', 'underscore-min', 'backbone-min',
            'app/backbone_models', 'app/backbone_views'],
            function($, _, Backbone, models, views) {
                return {
                    initialize : index($, _, Backbone, models, views),
                };
            }
);

function index($, _, Backbone, models, views) {
    return function () {
        var index_sb_model    = new  models.DataSource({
            url: '/prof_query',
        });
        var index_search_bar  = new views.SearchBar({
            el: 'input#main_sfield',
            id: 'main_sfield',
            container: '#auto-complete',
            model: index_sb_model,
        });
    };
}
