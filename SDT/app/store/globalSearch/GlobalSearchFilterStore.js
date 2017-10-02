Ext.define('SDT.store.globalSearch.GlobalSearchFilterStore', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'SDT.model.dashboard.DashboardChartsModel',
    proxy: {
        type: 'ajax',
        url: '',
        reader: {
            type: 'json'
        },
        actionMethods: {
            read: 'POST'
        },
        jsonData: true
    }
});