Ext.define('SDT.store.dashboard.DashboardChartsStore', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'SDT.model.dashboard.DashboardChartsModel',
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            rootProperty: 'facet_counts'
        },
        writer: {
            type: 'json'
        }
    }
});