Ext.define('SDT.store.dashboardAdmin.SeriesStore', {
    extend: 'Ext.data.Store',
    model: 'SDT.model.dashboardAdmin.SeriesModel',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});