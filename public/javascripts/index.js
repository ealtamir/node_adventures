define(['jquery-ui-1.10.3.min', 'underscore-min', 'backbone-min',
            'app/models', 'app/views', 'app/components'],
            function($, _, Backbone, models, views, comps) {
                'use strict';
                return {
                    initialize : index($, _, Backbone, models, views, comps),
                };
            }
);

function index($, _, Backbone, models, views, comps) {
    'use strict';
    return function () {
        var statusBar           = new views.StatusBar({
            id: 'status_bar',
            el: 'div#status_bar',
        });
        var auth_popover        = new comps.AuthPopoverView({
            id: 'bar_auth_zone'
        });
        var index_sb_model      = new  models.DataSource({
            url: '/prof_query',
        });
        var index_search_bar    = new views.SearchBar({
            el: 'input#main_sfield',
            id: 'main_sfield',
            container: '#auto-complete',
            model: index_sb_model,
        });
    };
}
