Ext.define('SDT.store.dashboard.DashboardConfigStore', {
    extend: 'Ext.data.Store',
	autoLoad: false,
	model: 'SDT.model.dashboard.DashboardConfigModel',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});