Ext.define('SDT.model.dashboard.DashboardChartsModel', {
    extend: 'Ext.data.Model',
    idProperty: 'chartid',
    fields: [
        'chartid',
        'facet_counts'
    ]
});