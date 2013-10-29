define({
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
    }
});
