Ext.define('SDT.store.dashboard.DashboardCriteriaCombosStore', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    storeId: 'DashboardCriteriaCombosStore',
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