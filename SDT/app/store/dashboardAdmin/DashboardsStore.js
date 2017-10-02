Ext.define('SDT.store.dashboardAdmin.DashboardsStore', {
    extend: 'Ext.data.Store',
    model: 'SDT.model.dashboardAdmin.DashboardsModel',
    proxy: {
        type: 'memory',
		reader:{ type: 'json' }
    }
});