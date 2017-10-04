Ext.define('SDT.store.dashboard.DashboardConfigStore', {
    extend: 'Ext.data.Store',
    storeId: 'DashboardConfigStore',
    model: 'SDT.model.dashboard.DashboardConfigModel',
    proxy: {
        type: 'localstorage',
        id: 'default-dashboards'
    }
});