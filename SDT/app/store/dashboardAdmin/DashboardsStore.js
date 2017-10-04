Ext.define('SDT.store.dashboardAdmin.DashboardsStore', {
    extend: 'Ext.data.Store',
    model: 'SDT.model.dashboard.DashboardConfigModel',
    proxy: {
        type: 'memory',
		reader:{ type: 'json' }
    }
});