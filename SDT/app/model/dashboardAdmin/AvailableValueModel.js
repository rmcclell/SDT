Ext.define('SDT.model.dashboardAdmin.AvailableValueModel', {
    extend: 'Ext.data.Model',
    fields: [
    // mapping is needed for array store because reader is an array type
        {name: 'value', mapping: 0, convert: function (val, record) {
            return val === null ? 'Not Set' : val; //Enable facet.missing allow null to be returned with count
        }
    },
        { name: 'count', type: 'int', mapping: 1 }
    ]
});