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
        },

        getTimestamp : function(t_stamp) {
            var d = null;

            if (t_stamp !== undefined) {
               d = new Date(t_stamp);
            } else {
               d = new Date();
            }

            var s = '';
            s += d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getUTCDate();
            s += ' ';
            s += d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

            return s;
        }
    };
});
