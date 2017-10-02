Ext.define('SDT.store.dashboard.DashboardListsStore', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'SDT.model.dashboard.DashboardListsModel',
    proxy: {
        type: 'ajax',
        url: '/data/mock/dashboard/DashboardsMenu.json',
        reader: {
            type: 'json',
            rootProperty: 'response.docs'
        }
    }
});