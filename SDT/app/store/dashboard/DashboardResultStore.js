Ext.define('SDT.store.dashboard.DashboardResultStore', {
    extend: 'Ext.data.Store',
    remoteFilter: false,
    remoteSort: true,
    pageSize: 60,
    autoLoad: false,
    model: 'SDT.model.dashboard.DashboardResultModel',
    proxy: {
        type: 'ajax',
        limitParam: 'rows',
        sortParam: 'sort',
        startParam: 'start',
        simpleSortMode: true,
        directionParam: 'direction',
        reader: {
            type: 'json',
            rootProperty: 'response.docs',
            totalProperty: 'response.numFound'
        }
    }
});