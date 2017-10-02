Ext.define('SDT.store.dashboard.DashboardSelectedFilterStore', {
    extend: 'Ext.data.Store',
    model: 'SDT.model.dashboard.DashboardSelectedFilterModel',
    data: [],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});