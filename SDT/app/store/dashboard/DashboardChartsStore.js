Ext.define('SDT.store.dashboard.DashboardChartsStore', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    storeId: 'DashboardChartsStore',
    model: 'SDT.model.dashboard.DashboardChartsModel',
    proxy: {
        type: 'ajax',
        noCache: false,
        limitParam: '',
        startParam: '',
        pageParam: '',
        reader: {
            type: 'json',
            rootProperty: 'facet_counts'
        },
        writer: {
            type: 'json'
        }
    }
});