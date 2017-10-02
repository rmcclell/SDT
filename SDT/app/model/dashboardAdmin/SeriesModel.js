Ext.define('SDT.model.dashboardAdmin.SeriesModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    identifier: 'uuid',
    fields: [
        { name: 'id', persist: false },
        'group',
        'label',
        'rangeCriteria',
        { name: 'seriesCriteria', convert: function (val, record) {
            return (Ext.isEmpty(val)) ? record.data.rangeCriteria : val; //Temp till legacy dashboards migrated
        } },
        'criteria',
        'criteriaGrouping',
        'filterGroupingType',
        'facetQuery',
        { name: 'color', defaultValue: false }
    ]
});