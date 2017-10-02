Ext.define('SDT.model.dashboard.DashboardQueryConfigModel', {
    extend: 'Ext.data.Model',
    fields: [
        'criteria',
        'facet',
        'criteriaGrouping',
        'filterGroupingType',
        'sorting',
        'filters'
    ]
});