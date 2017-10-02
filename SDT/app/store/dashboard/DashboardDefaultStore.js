Ext.define('SDT.store.dashboard.DashboardDefaultStore', {
    extend: 'Ext.data.Store',
    fields:['id'],
    proxy: {
        type: 'ajax',
		url: '/data/mock/dashboard/DefaultDashboardsId.json',
        reader: {
            type: 'json',
            rootProperty: 'response.docs'
        }
    }
});