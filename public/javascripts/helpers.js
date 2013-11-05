define(['app/constants'], function(c) {
    return {
        process_data : function(data) {
            var autocom_rows = [];

            if (data instanceof Array) {
                data.forEach(function(row, i, arr) {
                    autocom_rows.push({
                        label : row.name
                    });
                });
          }

            return autocom_rows;
        },

        get_prof_name : function() {
            var url = window.location.pathname;
            var name = url.match(c.P_VIEW_REVIEWS_RGX)[1];

            return name.replace(/-/g, ' ');
        }
    };
});
