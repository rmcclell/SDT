Ext.define('SDT.store.dashboardAdmin.ChartStore', {
    extend: 'Ext.data.Store',
    model: 'SDT.model.dashboardAdmin.ChartModel',
    autoLoad: false,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});