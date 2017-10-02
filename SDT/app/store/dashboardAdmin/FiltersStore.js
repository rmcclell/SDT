Ext.define('SDT.store.dashboardAdmin.FiltersStore', {
    extend: 'Ext.data.Store',
    model: 'SDT.model.dashboardAdmin.FiltersModel',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});